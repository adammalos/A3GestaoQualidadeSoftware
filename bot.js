const prompt = require('prompt-sync')();
const nodemailer = require('nodemailer');

// Configurações do serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'RecTeste@outlook.com',
    pass: '6mvF#m1Q8K17'
  }
});

// E-mail e senha cadastrados
let senhaCadastrada = 'admin1234';
let senhaExpirada = false; // Variável para controlar se o tempo expirou

// Função para gerar uma senha aleatória
function gerarSenha() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let senha = '';
  for (let i = 0; i < 8; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    senha += caracteres.charAt(indice);
  }
  return senha;
}

// Função para enviar o e-mail com a nova senha
async function enviarEmailNovaSenha(email, novaSenha) {
  const mensagem = {
    from: 'RecTeste@outlook.com',
    to: email,
    subject: 'Nova senha gerada',
    text: `Sua nova senha é: ${novaSenha}`
  };

  try {
    const info = await transporter.sendMail(mensagem);
    console.log('E-mail enviado com a nova senha:', info.response);
  } catch (error) {
    console.log('Erro ao enviar e-mail:', error);
  }
}

// Função para tratar acesso negado após o tempo expirado
function acessoNegado() {
  console.log('Acesso negado. O tempo para a nova senha expirou.');

  const enviarNovamente = prompt('Deseja enviar um novo e-mail com a senha? (sim/não): ');
  if (enviarNovamente.toLowerCase() === 'sim') {
    const novaSenha = gerarSenha();
    senhaCadastrada = novaSenha;
    console.log('Nova senha gerada:', novaSenha);

    enviarEmailNovaSenha(novaSenha);

    recuperarSenha();
  } else {
    console.log('Acesso negado.');
  }
}

// Função principal do sistema de recuperação de senha
async function recuperarSenha() {
  const senhaInserida = prompt('Insira a senha: ');

  if (senhaInserida === senhaCadastrada) {
    console.log('Senha correta. Acesso permitido.');
  } else {
    console.log('Senha incorreta.');

    const criarNovaSenha = prompt('Deseja criar uma nova senha? (sim/não): ');

    if (criarNovaSenha.toLowerCase() === 'sim') {
      const novaSenha = gerarSenha();
      senhaCadastrada = novaSenha;
      console.log('Nova senha gerada:', novaSenha);

      enviarEmailNovaSenha('admin@email.com', novaSenha);

      setTimeout(function() {
        senhaExpirada = true; // Define a variável para indicar que o tempo expirou
        if (senhaInserida !== novaSenha) {
          acessoNegado();
        }
      }, 600000); // 10 segundos

      console.log('Aguarde o e-mail com a nova senha...');
      const senhaInseridaEmail = prompt('Insira a nova senha recebida por e-mail: ');

      if (!senhaExpirada && senhaInseridaEmail === novaSenha) {
        console.log('Senha correta. Acesso permitido.');
      } else if (!senhaExpirada) {
        console.log('Senha incorreta. Acesso negado.');
      } else {
        acessoNegado();
      }
    } else {
      console.log('Acesso negado.');
    }
  }
}

// Iniciar o sistema de recuperação de senha
recuperarSenha();
