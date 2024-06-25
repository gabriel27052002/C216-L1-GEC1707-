const restify = require('restify');
const { Pool } = require('pg');

var server = restify.createServer({
    name: 'pratica-4-gabriel',
});
server.use(restify.plugins.bodyParser());

/*-----------------------Database-----------------------*/

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'livros',
    password: process.env.POSTGRES_PASSWORD || 'senha123',
    port: process.env.POSTGRES_PORT || 5432,
});

async function initDatabase() {
    try {
        await pool.query('DROP TABLE IF EXISTS livros');
        await pool.query('CREATE TABLE IF NOT EXISTS livros (id SERIAL PRIMARY KEY, autor VARCHAR(255) NOT NULL, nome_livro VARCHAR(255) NOT NULL, categoria VARCHAR(255) NOT NULL)');
        console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao iniciar o banco de dados, tentando novamente em 5 segundos:', error);
        setTimeout(initDatabase, 5000);
    }
}

/*-----------------------------livro-----------------------------*/
server.post('/api/v1/livro/inserir', async (req, res, next) => {
    const { autor, nome_livro, categoria } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO livros (autor, nome_livro, categoria) VALUES ($1, $2, $3) RETURNING *',
            [autor, nome_livro, categoria]
        );
        res.send(201, result.rows[0]);
        console.log('livro inserido com sucesso:', result.rows[0]);
    } catch (error) {
        res.send(500, { message: 'Erro ao inserir livro' });
        console.error('Erro ao inserir livro:', error);
    }

    return next();
});

server.get('/api/v1/livro/listar', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM livros');
        res.send(200, result.rows);
        console.log('livros encontrados:', result.rows);
    } catch (error) {
        res.send(500, { message: 'Erro ao listar livros' });
    }
    return next();
});

server.post('/api/v1/livro/atualizar', async (req, res, next) => {
    const { id, autor, nome_livro, categoria } = req.body;

    try {
        const result = await pool.query(
            'UPDATE livros SET autor = $1, nome_livro = $2, categoria = $3 WHERE id = $4 RETURNING *',
            [autor, nome_livro, categoria, id]
        );
        if (result.rowCount === 0) {
            res.send(404, { message: 'livro não encontrado' });
        } else {
            res.send(200, result.rows[0]);
            console.log('livro atualizado com sucesso:', result.rows[0]);
        }
    } catch
    (error) {
        res.send(500, { message: 'Erro ao atualizar livro' });
        console.error('Erro ao atualizar livro:', error);
    }
    return next();
});

server.post('/api/v1/livro/excluir', async (req, res, next) => {
    const { id } = req.body;

    try {
        const result = await pool.query('DELETE FROM livros WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.send(404, { message: 'livro não encontrado' });
        } else {
            res.send(200, { message: 'livro excluído com sucesso' });
            console.log('livro excluído com sucesso');
        }
    } catch (error) {
        res.send(500, { message: 'Erro ao excluir livro' });
        console.error('Erro ao excluir livro:', error);
    }

    return next();
});

server.del('/api/v1/database/reset', async (req, res, next) => {
    try {
        await pool.query('DROP TABLE IF EXISTS livros');
        await pool.query('CREATE TABLE IF NOT EXISTS livros (id SERIAL PRIMARY KEY, autor VARCHAR(255) NOT NULL, nome_livro VARCHAR(255) NOT NULL, categoria VARCHAR(255) NOT NULL)');
        res.send(200, { message: 'Banco de dados resetado com sucesso' });        console.log('Banco de dados resetado com sucesso');
    } catch (error) {
        res.send(500, { message: 'Erro ao resetar banco de dados' });
        console.error('Erro ao resetar banco de dados:', error);
    }

    return next();
});




// iniciar o servidor
var port = process.env.PORT || 5000;

server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With'
    );
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

server.listen(port, function () {
    console.log('Servidor iniciado', server.name, ' na url http://localhost:' + port);
    console.log('Iniciando banco de dados...');
    initDatabase();
})