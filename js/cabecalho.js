// cabecalho.js
// Monta o cabeçalho de todas as páginas: logo, menu com ícones e a pílula "Energia de hoje".
// Uso no HTML: <header id="cabecalho" data-pagina="habitos" data-raiz=".."></header>
// Precisa de dados.js, textos.js e svg.js carregados antes.

const PAGINAS_DO_MENU = [
  { id: 'meu-dia', texto: 'Meu dia', icone: 'icone-meu-dia', endereco: 'pages/meu-dia.html' },
  { id: 'habitos', texto: 'Hábitos', icone: 'icone-habitos', endereco: 'pages/habitos.html' },
  { id: 'metas', texto: 'Metas', icone: 'icone-metas', endereco: 'pages/metas.html' },
  { id: 'diario', texto: 'Diário', icone: 'icone-diario', endereco: 'pages/diario.html' }
];

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  if (texto) {
    elemento.textContent = texto;
  }

  return elemento;
}

// Grava a energia do dia e avisa todas as telas abertas (cabeçalho e página).
function registrarEnergia(nivel) {
  if (!salvarEnergiaDeHoje(nivel)) {
    return false;
  }

  document.dispatchEvent(new CustomEvent('energia-alterada', { detail: { nivel: nivel } }));
  return true;
}

function montarPilulaDeEnergia(raiz) {
  const pilula = criarElemento('details', 'cab-energia');
  const resumo = criarElemento('summary', 'cab-energia-resumo');
  const ponto = criarElemento('span', 'cab-energia-ponto');
  const rotulo = criarElemento('span', 'cab-energia-rotulo', TEXTOS.cabecalho.energiaDeHoje + ':');
  const valor = criarElemento('strong', 'cab-energia-valor');
  const aviso = criarElemento('span', 'visualmente-oculto');

  ponto.setAttribute('aria-hidden', 'true');
  aviso.setAttribute('role', 'status');
  resumo.append(ponto, rotulo, valor, criarSvg(raiz, 'icone-seta-baixo', 'icone'));

  const painel = criarElemento('div', 'cab-energia-painel');
  const nota = criarElemento('p', 'campo-ajuda');
  const opcoes = criarElemento('div', 'cab-energia-opcoes');

  painel.appendChild(criarElemento('p', 'cab-energia-titulo', TEXTOS.cabecalho.escolher));

  NIVEIS_ENERGIA.forEach(function (nivel) {
    const botao = criarElemento('button', 'opcao');
    botao.type = 'button';
    botao.dataset.nivel = nivel;
    botao.append(
      criarSvg(raiz, SIMBOLO_DA_ENERGIA[nivel], 'ilustracao', 32, 48),
      criarElemento('strong', '', TEXTOS.energia[nivel].nome),
      criarElemento('span', '', TEXTOS.energia[nivel].estagio)
    );

    botao.addEventListener('click', function () {
      registrarEnergia(nivel);
      pilula.open = false;
      resumo.focus();
    });

    opcoes.appendChild(botao);
  });

  painel.append(opcoes, nota);
  pilula.append(resumo, painel, aviso);

  function atualizar() {
    const registrada = lerEnergiaDeHoje();
    const nivel = registrada || ENERGIA_PADRAO;

    valor.textContent = TEXTOS.energia[nivel].nome + (registrada ? '' : ' ' + TEXTOS.cabecalho.padrao);
    ponto.classList.toggle('cab-energia-ponto-vazio', registrada === null);
    nota.textContent = registrada ? '' : TEXTOS.energia.semRegistro;

    opcoes.querySelectorAll('.opcao').forEach(function (botao) {
      botao.setAttribute('aria-pressed', String(botao.dataset.nivel === registrada));
    });
  }

  atualizar();

  document.addEventListener('energia-alterada', function (evento) {
    atualizar();
    aviso.textContent = TEXTOS.cabecalho.energiaDeHoje + ': ' + TEXTOS.energia[evento.detail.nivel].nome;
  });

  document.addEventListener('click', function (evento) {
    if (pilula.open && !pilula.contains(evento.target)) {
      pilula.open = false;
    }
  });

  pilula.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      pilula.open = false;
      resumo.focus();
    }
  });

  return pilula;
}

function montarCabecalho() {
  const cabecalho = document.getElementById('cabecalho');

  if (!cabecalho) {
    return;
  }

  const raiz = cabecalho.dataset.raiz || '.';
  const paginaAtual = cabecalho.dataset.pagina;

  const logo = criarElemento('a', 'cab-logo');
  logo.href = raiz + '/index.html';
  logo.setAttribute('aria-label', TEXTOS.cabecalho.paginaInicial);
  logo.append(criarSvg(raiz, 'logo-flor', 'ilustracao', 26, 36), criarElemento('span', '', 'Bloom'));

  const menu = criarElemento('nav', 'cab-menu');
  menu.setAttribute('aria-label', 'Principal');

  PAGINAS_DO_MENU.forEach(function (pagina) {
    const link = criarElemento('a', 'cab-link');
    link.href = raiz + '/' + pagina.endereco;
    link.append(criarSvg(raiz, pagina.icone, 'icone'), criarElemento('span', '', pagina.texto));

    if (pagina.id === paginaAtual) {
      link.setAttribute('aria-current', 'page');
    }

    menu.appendChild(link);
  });

  cabecalho.className = 'cab';
  cabecalho.replaceChildren(logo, menu, montarPilulaDeEnergia(raiz));
}

montarCabecalho();