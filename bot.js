const prompt = require('prompt-sync')();
const nodemailer = require('nodemailer');

// Configurações do serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'senharec0@outlook.com',
    pass: 'S0Ks9eWIlx8@'
  }
});

// E-mail e senha cadastrados
const emailCadastrado = 'admin@email.com';
let senhaCadastrada = 'admin1234';

// Função para gerar uma senha aleatória
function gerarSenha() {
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var senha = '';
  for (var i = 0; i < 8; i++) {
    var indice = Math.floor(Math.random() * caracteres.length);
    senha += caracteres.charAt(indice);
  }
  return senha;
}

// Função para enviar o e-mail com a nova senha
function enviarEmailNovaSenha(email, novaSenha) {
  const mensagem = {
    from: 'senharec0@outlook.com',
    to: email,
    subject: 'Nova senha gerada',
    text: `Sua nova senha é: ${novaSenha}`
  };

  transporter.sendMail(mensagem, function(error, info) {
    if (error) {
      console.log('Erro ao enviar e-mail:', error);
    } else {
      console.log('E-mail enviado com a nova senha:', info.response);
    }
  });
}

// Função principal do sistema de recuperação de senha
function recuperarSenha() {
  var senhaInserida = prompt('Insira a senha: ');

  if (senhaInserida === senhaCadastrada) {
    console.log('Senha correta. Acesso permitido.');
  } else {
    console.log('Senha incorreta.');

    var criarNovaSenha = prompt('Deseja criar uma nova senha? (sim/não): ');

    if (criarNovaSenha.toLowerCase() === 'sim') {
      var novaSenha = gerarSenha();
      senhaCadastrada = novaSenha;
      console.log('Nova senha gerada:', novaSenha);

      enviarEmailNovaSenha(emailCadastrado, novaSenha);

      recuperarSenha(); // Chamada recursiva para permitir uma nova tentativa de senha
    } else {
      console.log('Acesso negado.');
    }
  }
}

// Iniciar o sistema de recuperação de senha
recuperarSenha();
