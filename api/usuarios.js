import clientPromise from './mongodb.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            sucesso: false,
            mensagem: 'Método não permitido.'
        });
    }

    try {
        const client = await clientPromise;
        const db = client.db('suit');
        const usuarios = db.collection('usuarios');

        const resultado = await usuarios
            .find({})
            .project({
                senha: 0
            })
            .sort({
                criado_em: -1
            })
            .toArray();

        return res.status(200).json({
            sucesso: true,
            usuarios: resultado
        });

    } catch (err) {
        console.error('ERRO AO BUSCAR USUÁRIOS:', err);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar usuários.'
        });
    }
}