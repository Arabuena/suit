<?php
require_once 'config.php';

$stmt = $pdo->query("SELECT id, nome, email, criado_em FROM usuarios ORDER BY criado_em DESC");
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuários Cadastrados</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .container {
            width: 100%;
            max-width: 700px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            padding: 40px;
        }
        h2 {
            text-align: center;
            margin-bottom: 10px;
            color: #333;
        }
        .counter {
            text-align: center;
            color: #777;
            margin-bottom: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            text-align: left;
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #667eea;
            color: white;
            font-weight: bold;
        }
        tr:last-child td {
            border-bottom: none;
        }
        tr:hover td {
            background: #f5f5ff;
        }
        .empty {
            text-align: center;
            color: #999;
            padding: 30px;
        }
        .voltar {
            display: block;
            text-align: center;
            margin-top: 25px;
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
        }
        .voltar:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Usuários Cadastrados</h2>
        <p class="counter"><?= count($usuarios) ?> usuário(s) encontrado(s)</p>

        <?php if (count($usuarios) > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Cadastro</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($usuarios as $u): ?>
                <tr>
                    <td><?= $u['id'] ?></td>
                    <td><?= htmlspecialchars($u['nome']) ?></td>
                    <td><?= htmlspecialchars($u['email']) ?></td>
                    <td><?= date('d/m/Y H:i', strtotime($u['criado_em'])) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
        <p class="empty">Nenhum usuário cadastrado ainda.</p>
        <?php endif; ?>

        <a href="suit.html" class="voltar">Voltar ao Login</a>
    </div>
</body>
</html>
