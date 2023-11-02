const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const apiVersion = '/api/v1';

const rotaAluno = require('./routes/aluno');


app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*'); // só permite o acesso da API por esse servidor
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
})

app.use(`${apiVersion}/aluno`, rotaAluno);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup({
    "openapi": "3.0.0",
    "info": {
        "title": "Desafio API",
        "description": "API para o desafio do bootcamp Desenvolver WEB/Cloud AWS da Generation Brasil",
        "version": "1.0.0"
    },
    "servers": [
        {
        "url": "https://api-desafio-aws.onrender.com",
        "desciption": "API no ar"
        }
    ],
    "paths": {
        "/api/v1/aluno/cadastro": {
            "post":{
                "sumary": "Cadastro de aluno",
                "description": "Essa rota é responsável por cadastrar um aluno.",
                "tags": ["Aluno"],
                "requestBody":{
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Aluno"
                                },
                                "examples": {
                                    "Aluno": {
                                        "value": {
                                            "nome": "João Silva",
	                                        "idade": 16,
	                                        "nota_1": 9.5,
	                                        "nota_2": 8.5,
	                                        "professor": "José",
	                                        "sala": 201
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "500": {
                            "description": "Internal Server Error"
                        },
                        "201": {
                            "description": "Aluno cadastrado com sucesso!",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "itens": {
                                            "$ref": "#/components/schemas/Aluno"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/v1/aluno/{id}": {
                "get": {
                    "description": "Essa rota é responsável por retornar um alunos cadastrado através de seu ID.",
                    "summary": "Busca de um aluno por id",
                    "tags": ["Aluno"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "description": "ID do aluno para busca",
                            "required": true
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "$ref": "#/components/schemas/Aluno"
                                    }
                                }
                            }
                        }
                    }
                },
                "patch": {
                    "description": "Essa rota é responsável por alterar as informações de um aluno através de seu ID.",
                    "summary": "Altera os dados de um aluno por id",
                    "tags": ["Aluno"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "description": "ID do aluno para alterar",
                            "required": true
                        }
                    ],
                    "requestBody":{
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Aluno"
                                    },
                                    "examples": {
                                        "Aluno": {
                                            "value": {
                                                "nome": "Maria Silva",
                                                "idade": 17,
                                                "nota_1": 8.5,
                                                "nota_2": 10,
                                                "professor": "Guilherme",
                                                "sala": 202
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    "responses": {
                        "201": {
                            "description": "Informações do aluno alterada com sucesso!",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "$ref": "#/components/schemas/Aluno"
                                    }
                                }
                            }
                        }
                    }
                },
                "delete": {
                    "description": "Essa rota é responsável por deletar um aluno através de seu ID.",
                    "summary": "Deleta um aluno por id",
                    "tags": ["Aluno"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "description": "ID do aluno para deletar",
                            "required": true
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Aluno deletado com sucesso!",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "$ref": "#/components/schemas/Aluno"
                                    }
                                }
                            }
                        },
                        "500": {
                            "description": "Internal Server Error"
                        },
                    }
                },

            }
        },
        "components": {
            "schemas": {
                "Aluno": {
                    "type": "object",
                    "properties": {
                        "nome": {
                            "type": "string"
                        },
                        "idade": {
                            "type": "number"
                        },
                        "nota_1": {
                            "type": "number"
                        },
                        "nota_2": {
                            "type": "number"
                        },
                        "professor": {
                            "type": "string"
                        },
                        "sala": {
                            "type": "number"
                        }
                    }
                }
            }
        }
    },
));

//TRATAMENTO PARA QUANDO NÃO FOR ENCONTRADO UMA ROTA
app.use((req, res, next) =>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;