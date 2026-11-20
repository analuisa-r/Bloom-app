// interface.js
// Funções de tela usadas por várias páginas.
// Precisa de um elemento <p id="mensagem"> na página.

const elemento = function (id) {
  return document.getElementById(id);
};

function mostrarMensagem(texto, tipo) {
  const caixa = elemento('mensagem');

  caixa.textContent = texto;
  caixa.className = 'mensagem mensagem-' + tipo;

  setTimeout(function () {
    caixa.className = 'mensagem';
    caixa.textContent = '';
  }, 3000);
}

// Recebe "2026-11-13" e devolve "sexta-feira, 13 de novembro de 2026".
function formatarDataLonga(dataAAAAMMDD) {
  return new Date(dataAAAAMMDD + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}