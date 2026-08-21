import { sql } from '@vercel/postgres';
import ensureTable from './config.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            sucesso: false,
            mensagem: 'Método não permitido.'
        });
    }

    try {
        console.log('Dados recebidos:', req.body);

        await ensureTable();

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos.'
            });
        }

        const existente = await sql`
            SELECT id FROM usuarios
            WHERE email = ${email}
        `;

        if (existente.rows.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'E-mail já cadastrado.'
            });
        }

        await sql`
            INSERT INTO usuarios (email, senha)
            VALUES (${email}, ${senha})
        `;

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Cadastro realizado com sucesso!'
        });

    } catch (err) {
        console.error('ERRO COMPLETO:', err);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro no servidor: ' + err.message
        });
    }
}