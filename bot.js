const prompt = require('prompt-sync')();

// Função para gerar senhas aleatória
function gerarSenha() {
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var senha = '';
  for (var i = 0; i < 8; i++) {
    var indice = Math.floor(Math.random() * caracteres.length);
    senha += caracteres.charAt(indice);
  }
  return senha;
}

// Função principal do bot
function bot() {
  var senhaGerada = gerarSenha();
  console.log('Senha gerada:', senhaGerada);

  var senhaInserida = prompt('Insira a senha: ');

  if (senhaInserida === senhaGerada) {
    console.log('Ok');
  } else {
    console.log('Error');
  }
}

// Iniciar o bot
bot();
