<?php
header('Content-Type: application/json');
require_once 'config.php';

$dados = json_decode(file_get_contents('php://input'), true);

$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$senha = $dados['senha'] ?? '';

if (empty($nome) || empty($email) || empty($senha)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Preencha todos os campos.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
$stmt->execute([':email' => $email]);

if ($stmt->fetch()) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'E-mail já cadastrado.']);
    exit;
}

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (:nome, :email, :senha)");
$stmt->execute([':nome' => $nome, ':email' => $email, ':senha' => $senhaHash]);

echo json_encode(['sucesso' => true, 'mensagem' => 'Cadastro realizado com sucesso!']);
