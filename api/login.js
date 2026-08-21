import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import ensureTable from './config.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, mensagem: 'Método não permitido.' });
  }

  try {
    await ensureTable();

    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos.' });
    }

    const resultado = await sql`SELECT * FROM usuarios WHERE email = ${email}`;

    if (resultado.rows.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = resultado.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' });
    }

    return res.status(200).json({ sucesso: true, mensagem: `Login realizado com sucesso! Bem-vindo, ${usuario.nome}.` });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor.' });
  }
}
