import clientPromise from './mongodb.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            sucesso: false,
            mensagem: 'Método não permitido.'
        });
    }

    try {
        const { email, senha } = req.body || {};

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos.'
            });
        }

        const client = await clientPromise;
        const db = client.db('suit');
        const usuarios = db.collection('usuarios');

        const existente = await usuarios.findOne({ email });

        if (existente) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'E-mail já cadastrado.'
            });
        }

        await usuarios.insertOne({
            email,
            senha,
            criado_em: new Date()
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Login realizado'
        });

    } catch (err) {
        console.error('ERRO NO CADASTRO:', err);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro no servidor.'
        });
    }
}