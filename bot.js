const prompt = require('prompt-sync')();
const nodemailer = require('nodemailer');

// Configurações do serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'enviadasenha@outlook.com',
    pass: 'W7bp!9e7L%WS'
  }
});

// E-mail e senha cadastrados
let senhaCadastrada = 'admin1234';

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
    from: 'enviadasenha@outlook.com',
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

      await enviarEmailNovaSenha('admin@email.com', novaSenha);

      setTimeout(async function() {
        console.log('Acesso negado. O tempo para a nova senha expirou.');

        const enviarNovamente = prompt('Deseja enviar um novo e-mail com a senha? (sim/não): ');
        if (enviarNovamente.toLowerCase() === 'sim') {
          const novaSenha = gerarSenha();
          senhaCadastrada = novaSenha;
          console.log('Nova senha gerada:', novaSenha);

          await enviarEmailNovaSenha(novaSenha);
          await recuperarSenha();
        } else {
          console.log('Acesso negado.');
        }
      }, 600000); // 10 segundos

      console.log('Aguarde o e-mail com a nova senha...');
      const senhaInserida = prompt('Insira a nova senha recebida por e-mail: ');

      if (senhaInserida === novaSenha) {
        console.log('Senha correta. Acesso permitido.');
      } else {
        console.log('Senha incorreta. Acesso negado.');
      }
    } else {
      console.log('Acesso negado.');
    }
  }
}

// Iniciar o sistema de recuperação de senha
recuperarSenha();
