// Aguarda todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Procura pelo formulário de login usando o ID que está no seu HTML
    const formLogin = document.getElementById('login-form');

    // Só executa o código abaixo se a pessoa estiver na página de login
    if (formLogin) {
        formLogin.addEventListener('submit', async (evento) => {
            // Impede a página de recarregar (comportamento padrão de um formulário)
            evento.preventDefault();

            // Pega os valores digitados usando os IDs do seu HTML
            const emailDigitado = document.getElementById('email').value;
            const senhaDigitada = document.getElementById('password').value;

            try {
                // O 'fetch' envia os dados de login para o servidor Node.js
                const respostaServidor = await fetch('/api/login', {
                    method: 'POST', // Método seguro para enviar dados sensíveis
                    headers: {
                        'Content-Type': 'application/json' // Avisa o servidor que é um formato JSON
                    },
                    body: JSON.stringify({ 
                        email: emailDigitado, 
                        senha: senhaDigitada 
                    })
                });

                // Transforma a resposta que volta do servidor
                const dados = await respostaServidor.json();

                // Verifica se o servidor aprovou o login (Status 200)
                if (respostaServidor.ok) {
                    // Sucesso! Redireciona o usuário para o painel administrativo
                    window.location.href = '/admin/index.html';
                } else {
                    // Erro! Mostra um alerta com a mensagem do servidor (ex: "E-mail incorreto")
                    alert(dados.erro);
                }
            } catch (erro) {
                console.error('Erro na comunicação com o servidor:', erro);
                alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
            }
        });
    }
});