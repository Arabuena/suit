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

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos.' });
    }

    const existente = await sql`SELECT id FROM usuarios WHERE email = ${email}`;

    if (existente.rows.length > 0) {
      return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await sql`INSERT INTO usuarios (nome, email, senha) VALUES (${nome}, ${email}, ${senhaHash})`;

    return res.status(201).json({ sucesso: true, mensagem: 'Cadastro realizado com sucesso!' });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor.' });
  }
}
