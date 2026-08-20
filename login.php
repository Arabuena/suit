<?php
header('Content-Type: application/json');
require_once 'config.php';

$dados = json_decode(file_get_contents('php://input'), true);

$email = trim($dados['email'] ?? '');
$senha = $dados['senha'] ?? '';

if (empty($email) || empty($senha)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Preencha todos os campos.']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
$stmt->execute([':email' => $email]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario || !password_verify($senha, $usuario['senha'])) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'E-mail ou senha incorretos.']);
    exit;
}

echo json_encode(['sucesso' => true, 'mensagem' => 'Login realizado com sucesso! Bem-vindo, ' . $usuario['nome'] . '.']);
