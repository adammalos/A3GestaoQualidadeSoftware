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
    from: 'senharec0@outlook.com',
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
  let senhaInserida = 'admin1234'; // Senha correta
  // Teste 1: Senha correta
  if (senhaInserida === senhaCadastrada) {
    console.log('Senha correta. Acesso permitido.');
  } else {
    console.log('Senha incorreta.');
  }

  // Teste 2: Senha errada sem gerar nova senha
  senhaInserida = 'senhaerrada';
  if (senhaInserida !== senhaCadastrada) {
    console.log('Senha incorreta.');

    // Teste 3: Senha errada com nova senha gerada
    const criarNovaSenha = 'sim';
    if (criarNovaSenha.toLowerCase() === 'sim') {
      const novaSenha = gerarSenha();
      senhaCadastrada = novaSenha;
      console.log('Nova senha gerada:', novaSenha);

      await enviarEmailNovaSenha('admin@example.com', novaSenha);

      setTimeout(async function() {
        console.log('Acesso negado. O tempo para a nova senha expirou.');

        // Teste 4: Senha errada sem usar nova senha gerada
        const enviarNovamente = 'nao';
        if (enviarNovamente.toLowerCase() === 'sim') {
          const novaSenha = gerarSenha();
          senhaCadastrada = novaSenha;
          console.log('Nova senha gerada:', novaSenha);

          await enviarEmailNovaSenha('admin@example.com', novaSenha);
          await recuperarSenha();
        } else {
          console.log('Acesso negado.');
        }
      }, 10000); // 10 segundos

      console.log('Aguarde o e-mail com a nova senha...');
      const senhaInseridaNovamente = novaSenha; // Usar nova senha gerada para os testes

      if (senhaInseridaNovamente === novaSenha) {
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
recuperarSenha()
  .then(() => {
    console.log('Teste concluído.');
  })
  .catch((error) => {
    console.log('Ocorreu um erro:', error);
  });
