const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = 4000;

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());

// ==========================================
// CONFIGURAÇÃO DO MULTER
// ==========================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Salva direto na pasta de imagens do Front-end
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        // Coloca a data atual na frente do nome para evitar que uma 
        // imagem com o mesmo nome apague a outra por acidente.
        const nomeUnico = Date.now() + '-' + file.originalname;
        cb(null, nomeUnico);
    }
});
const upload = multer({ storage: storage });


// ==========================================
// ROTAS DO SISTEMA
// ==========================================

// Rota 1: Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    const caminhoArquivo = path.join(__dirname, 'data', 'users.json');
    const dadosBrutos = fs.readFileSync(caminhoArquivo, 'utf-8');
    const usuarios = JSON.parse(dadosBrutos);

    const usuarioEncontrado = usuarios.find(
        (user) => user.email === email && user.senha === senha
    );

    if (usuarioEncontrado) {
        res.status(200).json({ mensagem: 'Login aprovado!', nome: usuarioEncontrado.nome });
    } else {
        res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
    }
});

// Rota 2: Cadastrar Evento
// O upload.single('imagem') avisa que vai chegar um arquivo com esse nome
app.post('/api/eventos', upload.single('imagem'), (req, res) => {
    // Pega os textos que vieram no formulário
    const { titulo, data, descricao } = req.body;
    
    // Pega o nome final do arquivo que o multer acabou de salvar na pasta
    const nomeDaImagem = req.file.filename;

    // Lê os eventos que já existem no JSON
    const caminhoArquivo = path.join(__dirname, 'data', 'eventos.json');
    const dadosBrutos = fs.readFileSync(caminhoArquivo, 'utf-8');
    const eventos = JSON.parse(dadosBrutos);

    // Cria o novo evento (com um ID sequencial)
    const novoEvento = {
        id: eventos.length > 0 ? eventos[eventos.length - 1].id + 1 : 1,
        titulo: titulo,
        data: data,
        descricao: descricao,
        imagem: nomeDaImagem
    };

    // Adiciona na lista e salva o arquivo json
    eventos.push(novoEvento);
    // O 'null, 2' formata o JSON para ele ficar bonito e pulando linhas
    fs.writeFileSync(caminhoArquivo, JSON.stringify(eventos, null, 2));

    // Responde com sucesso
    res.status(201).json({ mensagem: 'Evento criado com sucesso!' });
});

// ==========================================
// LIGANDO O SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`Servidor do Terê Verde Online rodando na porta ${PORT}!`);
    console.log(`Acesse: http://localhost:${PORT}`);
});