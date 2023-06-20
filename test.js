const nodemailer = require('nodemailer');

// Configurações do serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'RecTeste@outlook.com',
    pass: '6mvF#m1Q8K17'
  }
});

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
    throw new Error('Erro ao enviar e-mail');
  }
}

// Função principal do sistema de recuperação de senha
async function recuperarSenha(senhaInserida) {
  const senhaCadastrada = 'admin1234'; // Senha correta

  if (senhaInserida === senhaCadastrada) {
    return 'Senha correta. Acesso permitido.';
  } else {
    throw new Error('Senha incorreta.');
  }
}

// Testes utilizando Jest
describe('Recuperação de Senha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Recuperação de senha com a senha correta', async () => {
    const senhaInserida = 'admin1234';
    const resultado = await recuperarSenha(senhaInserida);
    expect(resultado).toBe('Senha correta. Acesso permitido.');
  });

  test('Recuperação de senha com senha incorreta', async () => {
    const senhaInserida = 'senhaerrada';
    try {
      await recuperarSenha(senhaInserida);
    } catch (error) {
      expect(error.message).toBe('Senha incorreta.');
    }
  });
});

// Teste de gerar nova senha
describe('Gerador de Senha', () => {
  test('Gerar nova senha', () => {
    const novaSenha = gerarSenha();
    expect(novaSenha.length).toBe(8);
  });
});

// Testes de envio de e-mail
describe('Envio de E-mail', () => {
  test('Enviar e-mail com nova senha', async () => {
    const email = 'admin@example.com';
    const novaSenha = 'abcdefg';
    const sendMailMock = jest.spyOn(transporter, 'sendMail').mockResolvedValue({});
    await enviarEmailNovaSenha(email, novaSenha);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'RecTeste@outlook.com',
      to: email,
      subject: 'Nova senha gerada',
      text: 'Sua nova senha é: abcdefg'
    });
  });

  test('Erro ao enviar e-mail', async () => {
    const email = 'admin@example.com';
    const novaSenha = 'abcdefg';
    const sendMailMock = jest.spyOn(transporter, 'sendMail').mockRejectedValue(new Error('Erro ao enviar e-mail'));
    try {
      await enviarEmailNovaSenha(email, novaSenha);
    } catch (error) {
      expect(error.message).toBe('Erro ao enviar e-mail');
    }
  });
});

  // Teste de senha expirada
  // describe('Senha Expirada', () => {
  //   test('Acesso negado após o tempo expirado', async () => {
  //     const senhaInserida = 'senhaerrada';
  //     const novaSenha = gerarSenha();
  //     jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.5);
  //     const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
  //     const sendMailMock = jest.spyOn(transporter, 'sendMail').mockResolvedValue({});
  //     const enviarEmailNovaSenhaMock = jest.fn();

  //     try {
  //       await recuperarSenha(senhaInserida);
  //     } catch (error) {
  //       expect(error.message).toBe('Senha incorreta.');
  //     }

  //     expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Acesso negado.'));
  //     expect(consoleLogMock).toHaveBeenCalledWith('Nova senha gerada:', novaSenha);
  //     expect(enviarEmailNovaSenhaMock).toHaveBeenCalledWith(expect.any(String), novaSenha);
  //   });
  // });
