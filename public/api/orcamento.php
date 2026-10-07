<?php
/**
 * Vivaze — recebe o formulário de orçamento do site e repassa ao Vivaze CRM.
 * Fica em public/api/orcamento.php (vira https://vivaze.com.br/api/orcamento.php).
 *
 * Fluxo: site (fetch) -> este arquivo (valida, antispam) -> CRM (cURL) -> JSON para o site.
 * Se o CRM falhar, o pedido é gravado em log (e enviado por e-mail, se configurado)
 * para nenhum lead se perder.
 */

declare(strict_types=1);

// ---------- configuração ----------
const CRM_URL = 'https://cabinefoto.com.br/vivaze-crm/public/pedido_orcamento.php';
const SITE_HOSTS = ['vivaze.com.br', 'www.vivaze.com.br']; // origens aceitas
const ALERT_EMAIL = 'vivaze01@gmail.com';          // e-mail que recebe o aviso quando o CRM falha (vazio = só log)
const ALERT_FROM = 'site@vivaze.com.br'; // remetente do aviso (use um e-mail do domínio)
const RATE_LIMIT = 5;            // máx. de envios por IP...
const RATE_WINDOW = 600;         // ...a cada 600 s (10 min)
const MIN_FILL_SECONDS = 3;      // tempo mínimo entre abrir a página e enviar

$CIDADES = ['Belo Horizonte', 'Betim', 'Brumadinho', 'Caeté', 'Confins', 'Contagem', 'Esmeraldas', 'Florestal', 'Ibirité',
  'Igarapé', 'Itabirito', 'Itaguara', 'Itaúna', 'Jaboticatubas', 'Juatuba', 'Lagoa Santa', 'Macacos', 'Mariana',
  'Mateus Leme', 'Nova Lima', 'Nova Serrana', 'Pedro Leopoldo', 'Prudente de Morais', 'Raposos', 'Ribeirão das Neves',
  'Rio Acima', 'Sabará', 'Santa Luzia', 'São Joaquim de Bicas', 'Sarzedo', 'Sete Lagoas', 'Vespasiano', 'Outra cidade'];
$TIPOS = ['Aniversário', 'Aniversário Infantil', 'Batizado', 'Chá de Revelação', 'Casamento', 'Corporativo', '15 anos',
  'Formatura', 'Ação de Marketing', 'Evento cultural', 'Evento Esportivo', 'Feira', 'Renovação de Votos', 'Outro'];
$CANAIS = ['Ligação rápida', 'WhatsApp', 'E-mail'];

// ---------- utilidades ----------
function responder(int $status, array $corpo): never {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($corpo, JSON_UNESCAPED_UNICODE);
  exit;
}

function pasta_logs(): string {
  $alvo = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/vivaze-logs'; // fora da pasta pública
  if (!is_dir($alvo)) { @mkdir($alvo, 0750, true); }
  return is_dir($alvo) && is_writable($alvo) ? $alvo : sys_get_temp_dir();
}

function registrar(string $arquivo, array $dados): void {
  $linha = json_encode(['em' => date('c')] + $dados, JSON_UNESCAPED_UNICODE) . "\n";
  @file_put_contents(pasta_logs() . '/' . $arquivo, $linha, FILE_APPEND | LOCK_EX);
}

function limpar(mixed $v, int $max): string {
  $s = is_string($v) ? trim($v) : '';
  $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
  return mb_substr($s, 0, $max);
}

// ---------- método e origem ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  header('Allow: POST');
  responder(405, ['ok' => false, 'erro' => 'metodo']);
}
$origem = parse_url($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '', PHP_URL_HOST);
if ($origem && !in_array($origem, SITE_HOSTS, true)) {
  responder(403, ['ok' => false, 'erro' => 'origem']);
}

// ---------- antispam ----------
// 1) honeypot: responde "ok" para o robô não insistir, mas não envia nada
if (limpar($_POST['website'] ?? '', 200) !== '') {
  responder(200, ['ok' => true]);
}
// 2) tempo mínimo de preenchimento (campo oculto "t" = timestamp em ms de quando o formulário abriu)
$aberto = (int) ($_POST['t'] ?? 0);
if ($aberto > 0 && (time() - intdiv($aberto, 1000)) < MIN_FILL_SECONDS) {
  responder(200, ['ok' => true]);
}
// 3) limite por IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$arqRate = pasta_logs() . '/rate-' . md5($ip) . '.json';
$marcas = is_file($arqRate) ? (json_decode((string) @file_get_contents($arqRate), true) ?: []) : [];
$marcas = array_values(array_filter($marcas, fn($t) => $t > time() - RATE_WINDOW));
if (count($marcas) >= RATE_LIMIT) {
  responder(429, ['ok' => false, 'erro' => 'limite']);
}
$marcas[] = time();
@file_put_contents($arqRate, json_encode($marcas), LOCK_EX);

// ---------- validação (repete a do navegador) ----------
$nome     = limpar($_POST['nome'] ?? '', 120);
$email    = limpar($_POST['email'] ?? '', 160);
$telefone = limpar($_POST['telefone'] ?? '', 16);
$cidade   = limpar($_POST['cidade_evento'] ?? '', 80);
$data     = limpar($_POST['data_evento'] ?? '', 10);
$tipo     = limpar($_POST['tipo_evento'] ?? '', 60);
$canal    = limpar($_POST['preferencia_recebimento_orcamento'] ?? '', 40);
$empresa  = limpar($_POST['empresa'] ?? '', 120);
$conv     = limpar($_POST['convidados'] ?? '', 40);
$mensagem = limpar($_POST['mensagem'] ?? '', 2000);

$erros = [];
if (mb_strlen($nome) < 2) $erros[] = 'nome';
if (strlen(preg_replace('/\D/', '', $telefone)) < 10) $erros[] = 'telefone';
if (!in_array($cidade, $CIDADES, true)) $erros[] = 'cidade_evento';
$dataOk = false;
if (preg_match('#^(\d{2})/(\d{2})/(\d{4})$#', $data, $m)) { $dataOk = checkdate((int) $m[2], (int) $m[1], (int) $m[3]); }
if (!$dataOk) $erros[] = 'data_evento';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $erros[] = 'email';
if ($tipo !== '' && !in_array($tipo, $TIPOS, true)) $erros[] = 'tipo_evento';
if ($canal !== '' && !in_array($canal, $CANAIS, true)) $erros[] = 'preferencia_recebimento_orcamento';
if (($_POST['consentimento'] ?? '') === '') $erros[] = 'consentimento';
if ($erros) {
  responder(422, ['ok' => false, 'erro' => 'validacao', 'campos' => $erros]);
}

// ---------- monta o pedido para o CRM ----------
// O CRM não tem campos para empresa e convidados: vão no início de "mensagem".
$cabecalho = [];
if ($empresa !== '') $cabecalho[] = "Empresa: $empresa";
if ($conv !== '') $cabecalho[] = "Convidados: $conv";
$mensagemCrm = trim(implode(' | ', $cabecalho) . ($cabecalho && $mensagem !== '' ? "\n\n" : '') . $mensagem);

$campos = [
  'nome' => $nome,
  'email' => $email,
  'telefone' => $telefone,
  'cidade_evento' => $cidade,
  'data_evento' => $data,
  'tipo_evento' => $tipo,
  'preferencia_recebimento_orcamento' => $canal,
  'mensagem' => $mensagemCrm,
  'website' => '', // honeypot do CRM: sempre vazio
];

// ---------- envio ao CRM ----------
$ch = curl_init(CRM_URL);
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => http_build_query($campos),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => false, // um redirecionamento (3xx) costuma indicar sucesso
  CURLOPT_CONNECTTIMEOUT => 5,
  CURLOPT_TIMEOUT => 15,
  CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded', 'User-Agent: VivazeSite/1.0'],
]);
$resposta = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$erroCurl = curl_error($ch);
curl_close($ch);

// TODO: depois do envio de teste, trocar por uma checagem do conteúdo da resposta do CRM
// (ou por JSON, se o CRM passar a devolver). Por ora: sucesso = resposta 2xx/3xx.
$sucesso = $resposta !== false && $status >= 200 && $status < 400;

if ($sucesso) {
  registrar('crm-respostas.log', ['status' => $status, 'trecho' => mb_substr(strip_tags((string) $resposta), 0, 300)]);
  responder(200, ['ok' => true]);
}

// ---------- falhou: não perde o lead ----------
registrar('pedidos-nao-enviados.log', ['status' => $status, 'erro' => $erroCurl, 'pedido' => $campos]);
if (ALERT_EMAIL !== '') {
  $corpo = "O CRM não aceitou este pedido de orçamento (HTTP $status $erroCurl). Entre em contato com o cliente:\n\n";
  foreach ($campos as $k => $v) { if ($k !== 'website') $corpo .= "$k: $v\n"; }
  @mail(ALERT_EMAIL, '[Site Vivaze] Pedido de orçamento NÃO chegou ao CRM', $corpo, "From: " . ALERT_FROM . "\r\nContent-Type: text/plain; charset=UTF-8");
}
responder(502, ['ok' => false, 'erro' => 'crm']);
