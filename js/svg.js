// svg.js
// Cria ícones e ilustrações a partir do arquivo assets/icones.svg.
// "raiz" é o caminho até a pasta principal do projeto: ".." nas páginas e "." no index.html.

const NS_SVG = 'http://www.w3.org/2000/svg';

// Qual flor representa cada nível de energia.
const SIMBOLO_DA_ENERGIA = {
  baixa: 'flor-botao',
  média: 'flor-abrindo',
  alta: 'flor-florida'
};

function criarSvg(raiz, idDoSimbolo, classe, largura, altura) {
  const svg = document.createElementNS(NS_SVG, 'svg');
  svg.setAttribute('class', classe);
  svg.setAttribute('aria-hidden', 'true');

  if (largura) {
    svg.setAttribute('width', largura);
    svg.setAttribute('height', altura || largura);
  }

  const uso = document.createElementNS(NS_SVG, 'use');
  uso.setAttribute('href', raiz + '/assets/icones.svg#' + idDoSimbolo);
  svg.appendChild(uso);

  return svg;
}