# Pratica 3 - Preparando um Middleware para CRUD

## Documentação restify

- [Restify](http://restify.com/)

## Postman - Testes de API

- [Download Postman](https://www.postman.com/downloads/)

## Docker Desktop

- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Exemplo de crud de professores com Restify

A seguir, veremos como criar endpoints RESTful para gerenciamento de professores. Utilizaremos o framework Node.js Restify para criar um servidor e implementar os métodos HTTP básicos para um CRUD de professores.

```javascript

const restify = require('restify');

// iniciar o servidor
var server = restify.createServer({
    name: 'pratica-3',
});

// configurar o servidor para aceitar JSON e query
server.use(restify.plugins.bodyParser());

// Array para armazenar os professores
let professores = [];

// Middleware para permitir o parsing do corpo da requisição
server.use(restify.plugins.bodyParser());

// Endpoint para inserir um novo professor
server.post('/api/v1/professor/inserir', (req, res, next) => {
    const { nome, disciplina, email } = req.body;

    // Simulação de inserção no banco de dados
    const novoprofessor = {
        id: professores.length + 1, // Simulação de um ID único
        nome,
        disciplina,
        email
    };

    professores.push(novoprofessor);

    res.send(201, novoprofessor);
    return next();
});

// Endpoint para listar todos os professores
server.get('/api/v1/professor/listar', (req, res, next) => {
    res.send(professores);
    return next();
});

// Endpoint para atualizar um professor existente
server.post('/api/v1/professor/atualizar', (req, res, next) => {
    const { id, nome, disciplina, email } = req.body;

    const professorIndex = professores.findIndex(professor => professor.id === id);
    if (professorIndex === -1) {
        res.send(404, { message: 'professor não encontrado' });
    } else {
        professores[professorIndex] = { id, nome, disciplina, email };
        res.send(200, professores[professorIndex]);
    }

    return next();
});

// Endpoint para excluir um professor pelo ID
server.post('/api/v1/professor/excluir', (req, res, next) => {
    const { id } = req.body;

    const professorIndex = professores.findIndex(professor => professor.id === id);
    if (professorIndex === -1) {
        res.send(404, { message: 'professor não encontrado' });
    } else {
        professores.splice(professorIndex, 1);
        res.send(200, { message: 'professor excluído com sucesso' });
    }

    return next();
});

// iniciar o servidor
var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log('Servidor iniciado', server.name, ' na url http://localhost:' + port);
})



```

Este é um exemplo simples de crud de professores. O exemplo acima mostra como criar um servidor Restify e implementar os métodos HTTP básicos para um CRUD de professores.
Ainda não utilizaremos banco de dados. Vamos utilizar o Postman para testar os metodos HTTP.

---

### Exercício Proposto: Gerenciamento de Professores com Restify

Neste exercício, o objetivo é criar uma API simples para gerenciamento de professores utilizando Node.js com Restify. Os endpoints serão responsáveis por inserir, listar, atualizar e excluir informações dos professores. Como não utilizaremos um banco de dados, os dados serão armazenados em um array em memória. Utilizar /api/v1/professor para padronizar os endpoints.

### Requisitos

1. **POST /inserir**: Receberá os seguintes parâmetros e fará a inserção do professor:
   - Nome
   - Disciplina
   - Email

2. **GET /listar**: Listará todos os professores cadastrados.

3. **POST /atualizar**: Receberá os seguintes parâmetros e fará a atualização das informações do professor (baseado no ID passado):
   - ID do professor a ser atualizado
   - Nome
   - Disciplina
   - Email

4. **POST /excluir**: Receberá o ID do professor a ser excluído. Deve retornar a quantidade de professores excluídos (se houver).

### OBSERVAÇÕES

Utilizaremos apenas body como payload para os metodos HTTP.

### Passos

1. Implemente a API utilizando Restify em Node.js, conforme os requisitos mencionados.
2. Rode o servidor utilizando docker-compose.
3. Teste os endpoints utilizando o Postman.
4. Certifique-se de que todas as funcionalidades estão funcionando conforme esperado.
5. Se necessário, faça ajustes ou melhorias na API.
6. Suba o os prints dos resultados para a pasta pratica-3/img.
7. Subir o export do postman para a pasta pratica-3/api-tests.

Este exercício permitirá que você pratique a criação de endpoints RESTful para gerenciamento de redisciplinas, manipulação de dados em memória e interação com uma API utilizando Restify em Node.js. Ao completá-lo, você estará mais familiarizado com esses conceitos, o que será útil para projetos futuros.

## OBSERVAÇÃO IMPORTANTE

### O PROJETO DEVERÁ SER EXECUTADO USANDO DOCKER

```shell
cd backend
docker-compose up --build
```

[Voltar ao início](../../README.md)
