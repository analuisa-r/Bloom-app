// textos.js
// Textos fixos do Bloom em um só lugar. Para mudar o tratamento (gênero), mude aqui.
// No HTML, um elemento com data-texto="grupo.chave" recebe o texto automaticamente.

const TEXTOS = {
  tratamento: {
    boasVindas: 'Bem-vinda ao Bloom',
    perguntaNome: 'Como você quer ser chamada?'
  },
  cabecalho: {
    energiaDeHoje: 'Energia de hoje',
    padrao: '(padrão)',
    escolher: 'Como está a sua energia?',
    paginaInicial: 'Bloom, página inicial'
  },
  energia: {
    baixa: { nome: 'Baixa', estagio: 'Em botão', aviso: 'Hoje o mínimo já conta.' },
    média: { nome: 'Média', estagio: 'Abrindo', aviso: 'Um dia de ritmo normal. Siga no seu tempo.' },
    alta: { nome: 'Alta', estagio: 'Florida', aviso: 'Dia de energia boa! Aproveite para avançar nos seus hábitos.' },
    semRegistro: 'Você ainda não registrou sua energia hoje. Enquanto isso, o Bloom considera energia média.'
  }
};

// pluralizar(1, 'hábito', 'hábitos') => "1 hábito"; pluralizar(2, ...) => "2 hábitos"
function pluralizar(quantidade, singular, plural) {
  return quantidade + ' ' + (quantidade === 1 ? singular : plural);
}

// "1 de 1 hábito cuidado hoje" / "2 de 5 hábitos cuidados hoje"
function textoHabitosCuidados(feitos, total) {
  const palavra = total === 1 ? 'hábito cuidado' : 'hábitos cuidados';

  return feitos + ' de ' + total + ' ' + palavra + ' hoje';
}

function aplicarTextos() {
  document.querySelectorAll('[data-texto]').forEach(function (alvo) {
    const texto = alvo.dataset.texto.split('.').reduce(function (grupo, chave) {
      return grupo ? grupo[chave] : undefined;
    }, TEXTOS);

    if (typeof texto === 'string') {
      alvo.textContent = texto;
    }
  });
}

if (typeof document !== 'undefined') {
  aplicarTextos();
}