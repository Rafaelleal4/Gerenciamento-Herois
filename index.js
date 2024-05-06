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

// Rota para buscar todos os herois
app.get('/herois', async (req, res) => {
    try {
        const {results} = await pool.query('SELECT * FROM herois');
        res.json({
            Total: results.rowCount,
             herois: results.rows});

    } catch (error) {
        console.error('Erro ao buscar herois', error);
        res.status(500).json({message: 'Erro ao buscar herois'});
    }
});

// Rota para buscar um heroi pelo id
app.get('/herois/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const {results} = await pool.query('SELECT * FROM herois WHERE id = $1', [id]);
        if (results.rowCount === 0) {
            return res.status(404).json({message: 'Heroi não encontrado'});
        }
        res.json(results.rows[0]);

    } catch (error) {
        console.error('Erro ao buscar heroi', error);
        res.status(500).json({message: 'Erro ao buscar heroi'});
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
        const {results} = await pool.query('UPDATE herois SET nome = $1, classe = $2, nivel = $3, vida = $4 WHERE id = $5', [nome, classe, nivel, vida, id]);
        if (results.rowCount === 0) {
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
        const {results} = await pool.query('DELETE FROM herois WHERE id = $1', [id]);
        if (results.rowCount === 0) {
            return res.status(404).json({message: 'Heroi não encontrado'});
        }
        res.json({message: 'Heroi deletado com sucesso'});

    } catch (error) {
        console.error('Erro ao deletar heroi', error);
        res.status(500).json({message: 'Erro ao deletar heroi'});
    }
});

// Rota para simular batalhas entre os herois
app.post('/batalha', async (req, res) => {
    const { heroi1_id, heroi2_id } = req.body;

    try {
        const { rows: herois } = await pool.query('SELECT * FROM herois WHERE id IN ($1, $2)', [heroi1_id, heroi2_id]);

        if (herois.length < 2) {
            return res.status(404).json({ message: 'Um ou ambos os herois não foram encontrados' });
        }

        let heroi1 = herois.find(heroi => heroi.id === heroi1_id);
        let heroi2 = herois.find(heroi => heroi.id === heroi2_id);

        // Simulação de batalha baseada no dano causado pelos herois
        while (heroi1.hp > 0 && heroi2.hp > 0) {
            heroi2.hp -= heroi1.nivel;
            heroi1.hp -= heroi2.nivel;
        }

        let vencedor_id = heroi1.hp > 0 ? heroi1.id : heroi2.id;

        await pool.query('INSERT INTO batalhas (heroi1_id, heroi2_id, vencedor_id) VALUES ($1, $2, $3)', [heroi1_id, heroi2_id, vencedor_id]);

        res.json({ message: 'Batalha concluída', vencedor_id });

    } catch (error) {
        console.error('Erro ao simular batalha', error);
        res.status(500).json({ message: 'Erro ao simular batalha' });
    }
});