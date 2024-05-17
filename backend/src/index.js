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
    database: process.env.POSTGRES_DB || 'professores',
    password: process.env.POSTGRES_PASSWORD || 'senha123',
    port: process.env.POSTGRES_PORT || 5432,
});

async function initDatabase() {
    try {
        await pool.query('DROP TABLE IF EXISTS professores');
        await pool.query('CREATE TABLE IF NOT EXISTS professores (id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, disciplina VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)');
        console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao iniciar o banco de dados, tentando novamente em 5 segundos:', error);
        setTimeout(initDatabase, 5000);
    }
}

/*-----------------------------Professor-----------------------------*/
server.post('/api/v1/professor/inserir', async (req, res, next) => {
    const { nome, disciplina, email } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO professores (nome, disciplina, email) VALUES ($1, $2, $3) RETURNING *',
            [nome, disciplina, email]
        );
        res.send(201, result.rows[0]);
        console.log('Professor inserido com sucesso:', result.rows[0]);
    } catch (error) {
        res.send(500, { message: 'Erro ao inserir professor' });
        console.error('Erro ao inserir professor:', error);
    }

    return next();
});

server.get('/api/v1/professor/listar', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM professores');
        res.send(200, result.rows);
        console.log('Professores encontrados:', result.rows);
    } catch (error) {
        res.send(500, { message: 'Erro ao listar professores' });
    }
    return next();
});

server.post('/api/v1/professor/atualizar', async (req, res, next) => {
    const { id, nome, disciplina, email } = req.body;

    try {
        const result = await pool.query(
            'UPDATE professores SET nome = $1, disciplina = $2, email = $3 WHERE id = $4 RETURNING *',
            [nome, disciplina, email, id]
        );
        if (result.rowCount === 0) {
            res.send(404, { message: 'Professor não encontrado' });
        } else {
            res.send(200, result.rows[0]);
            console.log('Professor atualizado com sucesso:', result.rows[0]);
        }
    } catch
    (error) {
        res.send(500, { message: 'Erro ao atualizar professor' });
        console.error('Erro ao atualizar professor:', error);
    }
    return next();
});

server.post('/api/v1/professor/excluir', async (req, res, next) => {
    const { id } = req.body;

    try {
        const result = await pool.query('DELETE FROM professores WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.send(404, { message: 'Professor não encontrado' });
        } else {
            res.send(200, { message: 'Professor excluído com sucesso' });
            console.log('Professor excluído com sucesso');
        }
    } catch (error) {
        res.send(500, { message: 'Erro ao excluir professor' });
        console.error('Erro ao excluir professor:', error);
    }

    return next();
});

server.del('/api/v1/database/reset', async (req, res, next) => {
    try {
        await pool.query('DROP TABLE IF EXISTS professores');
        await pool.query('CREATE TABLE IF NOT EXISTS professores (id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, disciplina VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)');
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