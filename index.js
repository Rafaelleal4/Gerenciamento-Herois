const express = require('express');
const {Pool} = require('pg');

const app = express();
const PORT = 4000;

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'herois',
    password: 'ds564',
    port: 5432
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para buscar todos os herois
app.get('/herois', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM herois');
        res.json({
            total: result.rowCount,
             herois: result.rows});

    } catch (error) {
        console.error('Erro ao buscar herois', error);
        res.status(500).json({message: 'Erro ao buscar herois'});
    }
});

// Rota para buscar um heroi pelo id
app.get('/herois/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query('SELECT * FROM herois WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Heroi não encontrado'});
        }
        res.json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao buscar heroi', error);
        res.status(500).json({message: 'Erro ao buscar heroi'});
    }
});

// Rota para buscar um heroi pelo nome
app.get('/herois/nome/:nome', async (req, res) => {
    const {nome} = req.params;

    try {
        const result = await pool.query('SELECT * FROM herois WHERE nome ILIKE $1', [`%${nome}%`]);
        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Herói não encontrado'});
        }
        res.json(result.rows);

    } catch (error) {
        console.error('Erro ao buscar herói', error);
        res.status(500).json({message: 'Erro ao buscar herói'});
    }
});

// Rota para criar um heroi
app.post('/herois', async (req, res) => {
    const {nome, classe, nivel, vida } = req.body;

    try {
        await pool.query('INSERT INTO herois (nome, classe, nivel, vida ) VALUES ($1, $2, $3, $4)', [nome, classe, nivel, vida]);
        res.status(201).json({message: 'Heroi criado com sucesso'});

    } catch (error) {
        console.error('Erro ao criar heroi', error);
        res.status(500).json({message: 'Erro ao criar heroi'});
    }
});

// Rota para atualizar um heroi
app.put('/herois/:id', async (req, res) => {
    const {id} = req.params;
    const {nome, classe, nivel, vida} = req.body;

    try {
        const result = await pool.query('UPDATE herois SET nome = $1, classe = $2, nivel = $3, vida = $4 WHERE id = $5', [nome, classe, nivel, vida, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Heroi não encontrado'});
        }
        res.json({message: 'Heroi atualizado com sucesso'});

    } catch (error) {
        console.error('Erro ao atualizar heroi', error);
        res.status(500).json({message: 'Erro ao atualizar heroi'});
    }
});

// Rota para deletar um heroi
app.delete('/herois/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query('DELETE FROM herois WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Heroi não encontrado'});
        }
        res.json({message: 'Heroi deletado com sucesso'});

    } catch (error) {
        console.error('Erro ao deletar heroi', error);
        res.status(500).json({message: 'Erro ao deletar heroi'});
    }
});

// Rota para simular batalhas entre os heróis
app.post('/batalha', async (req, res) => {
    const { id_heroi1, id_heroi2 } = req.body;

    try {
        // Consultar informações dos heróis no banco de dados
        const resultHeroi1 = await pool.query('SELECT * FROM herois WHERE id = $1', [id_heroi1]);
        const resultHeroi2 = await pool.query('SELECT * FROM herois WHERE id = $1', [id_heroi2]);

        // Verificar se os heróis existem
        if (resultHeroi1.rowCount === 0 || resultHeroi2.rowCount === 0) {
            return res.status(404).json({ message: 'Heroi não encontrado' });
        }

        const heroi1 = resultHeroi1.rows[0];
        const heroi2 = resultHeroi2.rows[0];

        // Calcular o dano causado por cada herói (com base no seu nível)
        const danoHeroi1 = heroi1.nivel;
        const danoHeroi2 = heroi2.nivel;

        // Determinar o vencedor com base no dano causado
        let resultadoBatalha;
        let vencedor_id;
        if (danoHeroi1 > danoHeroi2) {
            resultadoBatalha = `${heroi1.nome} venceu a batalha contra ${heroi2.nome}`;
            vencedor_id = heroi1.id;
        } else if (danoHeroi1 < danoHeroi2) {
            resultadoBatalha = `${heroi2.nome} venceu a batalha contra ${heroi1.nome}`;
            vencedor_id = heroi2.id;
        } else {
            resultadoBatalha = 'A batalha terminou em empate';
            vencedor_id = null; // ou algum valor que represente empate
        }

        // Registrar o resultado da batalha no banco de dados
        await pool.query('INSERT INTO batalhas (heroi1_id, heroi2_id, vencedor_id, resultado) VALUES ($1, $2, $3, $4)', [id_heroi1, id_heroi2, vencedor_id, resultadoBatalha]);

        res.status(200).json({ message: 'Batalha simulada com sucesso', resultado: resultadoBatalha });
    } catch (error) {
        console.error('Erro ao simular batalha', error);
        res.status(500).json({ message: 'Erro ao simular batalha' });
    }
});

// Rota para obter o histórico de batalhas com base nos herois
app.get('/historico-batalhas/:heroiId', async (req, res) => {
    try {
        const heroiId = parseInt(req.params.heroiId, 10);
        const result = await pool.query('SELECT * FROM batalhas WHERE heroi1_id = $1 OR heroi2_id = $1', [heroiId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar histórico de batalhas', error);
        res.status(500).json({message: 'Erro ao buscar histórico de batalhas'});
    }
});

// Rota para buscar batalhas pelo nome do herói
app.get('/batalhas/nome/:nome', async (req, res) => {
    const {nome} = req.params;

    try {
        const result = await pool.query('SELECT * FROM batalhas WHERE heroi1_id IN (SELECT id FROM herois WHERE nome ILIKE $1) OR heroi2_id IN (SELECT id FROM herois WHERE nome ILIKE $1)', [`%${nome}%`]);
        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Batalhas não encontradas'});
        }
        res.json(result.rows);

    } catch (error) {
        console.error('Erro ao buscar batalhas', error);
        res.status(500).json({message: 'Erro ao buscar batalhas'});
    }
});

