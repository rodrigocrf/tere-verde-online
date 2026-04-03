// src/server.js

// 1. Importando as ferramentas necessárias
const express = require('express');
const path = require('path');

// 2. Iniciando o aplicativo Express
const app = express();
const PORT = 4000;

// 3. Configurando o servidor para entregar os arquivos do Front-end
// O express.static diz ao servidor: "Tudo que estiver na pasta 'public', pode ser acessado pelo navegador"
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// 4. Configurando para aceitar dados no formato JSON (útil para o login depois)
app.use(express.json());

// 5. Ligando o servidor na porta 3000
app.listen(PORT, () => {
    console.log(`Servidor do Terê Verde Online rodando na porta ${PORT}!`);
    console.log(`Acesse: http://localhost:${PORT}`);
});