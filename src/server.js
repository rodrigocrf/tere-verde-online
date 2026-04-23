// src/server.js

// Importando as ferramentas
const express = require('express');
const path = require('path');
const fs = require('fs'); // Módulo nativo do Node para ler arquivos

const app = express();
const PORT = 4000;

// Configurações do servidor
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json()); // Permite que o servidor entenda o JSON que vem do Front-end

// ROTA DE LOGIN
app.post('/api/login', (req, res) => {
    //Pega os dados que o usuário digitou no navegador
    const { email, senha } = req.body;

    // Diz onde está o banco de dados (Usado arquivo JSON para o MVP)
    const caminhoArquivo = path.join(__dirname, 'data', 'users.json');

    // Ler o arquivo e transformar o texto em JavaScript
    const dadosBrutos = fs.readFileSync(caminhoArquivo, 'utf-8');
    const usuarios = JSON.parse(dadosBrutos);

    // Procura se existe alguém com esse email e senha
    const usuarioEncontrado = usuarios.find(
        (user) => user.email === email && user.senha === senha
    );

    // Da a resposta para o Front-end
    if (usuarioEncontrado) {
        // Se achou, devolve sucesso (Status 200)
        res.status(200).json({ mensagem: 'Login aprovado!', nome: usuarioEncontrado.nome });
    } else {
        // Se não achou, devolve erro (Status 401 - Não Autorizado)
        res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
    }
});

// Ligando o servidor
app.listen(PORT, () => {
    console.log(`Servidor do Terê Verde Online rodando na porta ${PORT}!`);
    console.log(`Acesse: http://localhost:${PORT}`);
});