import { sql } from '@vercel/postgres';
import ensureTable from './config.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ sucesso: false, mensagem: 'Método não permitido.' });
  }

  try {
    await ensureTable();

    const resultado = await sql`SELECT id, nome, email, criado_em FROM usuarios ORDER BY criado_em DESC`;

    return res.status(200).json({ sucesso: true, usuarios: resultado.rows });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor.' });
  }
}
