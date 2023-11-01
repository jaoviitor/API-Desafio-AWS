const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS ALUNOS
router.get('/', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM Aluno;',
            (error, result, fields) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: result});
            }
        )
    })
});

//RETORNA UM ALUNO ESPECIFICO
router.get('/:id', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM Aluno WHERE id = ?;',
            [req.params.id],
            (error, result, fields) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: result});
            }
        )
    })
});

//CADASTRA UM ALUNO NOVO
router.post('/cadastro', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            `INSERT INTO Aluno (nome, idade, nota_1, nota_2, professor, sala) VALEUS (?,?,?,?,?,?)`,
            [req.body.nome, req.body.idade, req.body.nota_1, req.body.nota_2, req.body.professor, req.body.sala],
            (error, results) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                res.status(201).send({
                    mensagem: 'Aluno cadastrado com sucesso!'
                })
            }
        )
    })
});

//ALTERA AS INFORMAÇÕES DE UM ALUNO
router.patch('/:id', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'UPDATE Aluno SET nome = ?, idade = ?, nota_1 = ?, nota_2 = ?, professor = ?, sala = ? WHERE id = ?',
            [req.body.nome, req.body.idade, req.body.nota_1, req.body.nota_2, req.body.professor, req.body.sala, req.params.id],
            (error, results) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                res.status(202).send({
                    mensagem: 'Aluno atualizado com sucesso!'
                })
            }
        )
    })
});

//DELETA UM ALUNO
router.delete('/:id', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'DELETE FROM Aluno WHERE id = ?',
            [req.params.id],
            (error, results) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                res.status(202).send({
                    mensagem: 'Aluno removido com sucesso!'
                })
            }
        )
    })
});

module.exports = router;