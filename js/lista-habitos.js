// lista-habitos.js
// Lista de hábitos de hoje, com caixinhas de marcar. Usada em Meu dia e em Hábitos.
// Regras da energia (em dados.js):
//   Baixa: mostra a versão mínima (se o hábito tiver) e concluir a mínima conta como cumprido.
//   Média e Alta: mostram o nome completo. Sem registro do dia vale Média.

// Devolve o texto principal e a linha de detalhe de um hábito para hoje.
function descreverHabitoParaHoje(habito, registro) {
  const feito = Boolean(registro);
  const modoMinimo = feito ? registro.versao === 'mínima' : usarVersaoMinima(habito);

  return {
    principal: modoMinimo ? habito.versaoMinima : habito.nome,
    detalhe: modoMinimo
      ? (feito ? 'Concluído na versão mínima' : 'Versão completa: ' + habito.nome)
      : ''
  };
}

function criarBotaoDaLista(texto, classe, descricaoAcessivel, aoClicar) {
  const botao = document.createElement('button');

  botao.type = 'button';
  botao.className = classe;
  botao.textContent = texto;
  botao.setAttribute('aria-label', descricaoAcessivel);
  botao.addEventListener('click', aoClicar);

  return botao;
}

// Desenha a lista dentro de "lista" (um <ul>). Opções:
//   aoMudar: roda depois de marcar ou desmarcar um hábito
//   aoEditar(habito) e aoExcluir(habito): se informadas, aparecem os botões
//   mostrarConstancia: acrescenta "Constância: N%" no detalhe
function desenharChecklistDeHoje(lista, opcoes) {
  const configuracao = Object.assign(
    { aoMudar: function () {}, aoEditar: null, aoExcluir: null, mostrarConstancia: false },
    opcoes
  );
  const concluidos = listarConcluidosDeHoje();

  lista.replaceChildren();

  listarHabitos().forEach(function (habito, indice) {
    const registro = concluidos.find(function (item) {
      return item.id === habito.id;
    });
    const descricao = descreverHabitoParaHoje(habito, registro);

    const item = document.createElement('li');
    item.className = 'item-habito' + (registro ? ' item-habito-feito' : '');

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.className = 'caixa';
    caixa.id = 'habito-hoje-' + indice;
    caixa.checked = Boolean(registro);

    caixa.addEventListener('change', function () {
      alternarConclusao(habito.id);
      configuracao.aoMudar();
    });

    const texto = document.createElement('label');
    texto.className = 'item-habito-texto';
    texto.htmlFor = caixa.id;

    const principal = document.createElement('span');
    principal.className = 'item-habito-nome';
    principal.textContent = descricao.principal;
    texto.appendChild(principal);

    const partesDoDetalhe = [descricao.detalhe];

    if (configuracao.mostrarConstancia) {
      partesDoDetalhe.push('Constância: ' + calcularConstancia(habito.id) + '%');
    }

    const detalheTexto = partesDoDetalhe.filter(Boolean).join(' · ');

    if (detalheTexto !== '') {
      const detalhe = document.createElement('span');
      detalhe.className = 'item-habito-detalhe';
      detalhe.textContent = detalheTexto;
      texto.appendChild(detalhe);
    }

    const categoria = document.createElement('span');
    categoria.className = 'chip';
    categoria.textContent = habito.categoria;

    item.append(caixa, texto, categoria);

    if (configuracao.aoEditar || configuracao.aoExcluir) {
      const acoes = document.createElement('div');
      acoes.className = 'item-habito-acoes';

      if (configuracao.aoEditar) {
        acoes.appendChild(criarBotaoDaLista(
          'Editar', 'botao botao-secundario botao-pequeno', 'Editar ' + habito.nome,
          function () { configuracao.aoEditar(habito); }
        ));
      }

      if (configuracao.aoExcluir) {
        acoes.appendChild(criarBotaoDaLista(
          'Excluir', 'botao botao-perigo botao-pequeno', 'Excluir ' + habito.nome,
          function () { configuracao.aoExcluir(habito); }
        ));
      }

      item.appendChild(acoes);
    }

    lista.appendChild(item);
  });
}