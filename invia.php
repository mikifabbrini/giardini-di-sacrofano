<?php
// Modulo "Richiedi informazioni" della pagina Contatti (Giardini di Sacrofano).
// Gira solo sul server del sito vero, con PHP: in locale (python http.server) non si esegue
// e il sito mostra la conferma della versione di prova.
// Prima di pubblicarlo: impostare DESTINATARIO e MITTENTE (una casella del dominio del sito,
// altrimenti molte poste scartano la mail). Credenziali e password non vanno mai scritte qui.

const DESTINATARIO = 'michele.fabbrini@themediacompany.it'; // provvisorio, da cambiare
const MITTENTE     = 'noreply@DOMINIO-DEL-SITO.it';          // da impostare con il dominio vero

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok' => false]); exit; }
if (!empty($_POST['_honey'])) { echo json_encode(['ok' => true]); exit; } // robot: si finge l'invio

$campo = function ($k, $max) { return trim(mb_substr(str_replace(["\r", "\n"], ' ', (string)($_POST[$k] ?? '')), 0, $max)); };
$nome = $campo('nome', 60); $cognome = $campo('cognome', 60); $tel = $campo('telefono', 40);
$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$msg = trim(mb_substr((string)($_POST['messaggio'] ?? ''), 0, 4000));
$privacy = !empty($_POST['privacy']);

if ($nome === '' || $cognome === '' || $tel === '' || !$email || $msg === '' || !$privacy) {
  http_response_code(422); echo json_encode(['ok' => false, 'errore' => 'campi']); exit;
}

$oggetto = 'Giardini di Sacrofano - richiesta informazioni da ' . $nome . ' ' . $cognome;
$testo = "Nuova richiesta dal sito Giardini di Sacrofano\n\n"
       . "Nome: $nome\nCognome: $cognome\nTelefono: $tel\nEmail: $email\n\nMessaggio:\n$msg\n\n"
       . "Inviata il " . date('d/m/Y H:i') . "\n";
$intest = "From: Giardini di Sacrofano <" . MITTENTE . ">\r\n"
        . "Reply-To: $email\r\n"
        . "Content-Type: text/plain; charset=utf-8\r\n";

$ok = mail(DESTINATARIO, '=?UTF-8?B?' . base64_encode($oggetto) . '?=', $testo, $intest);
if (!$ok) http_response_code(500);
echo json_encode(['ok' => (bool)$ok]);
