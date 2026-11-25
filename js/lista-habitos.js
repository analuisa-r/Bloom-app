// lista-habitos.js
// Lista "hábitos de hoje" com caixinhas de marcar. Usada na página Meu dia.
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

// Desenha a lista dentro de "lista" (um <ul>). "aoMudar" roda depois de marcar ou desmarcar.
function desenharChecklistDeHoje(lista, aoMudar) {
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
      aoMudar();
    });

    const texto = document.createElement('label');
    texto.className = 'item-habito-texto';
    texto.htmlFor = caixa.id;

    const principal = document.createElement('span');
    principal.className = 'item-habito-nome';
    principal.textContent = descricao.principal;
    texto.appendChild(principal);

    if (descricao.detalhe !== '') {
      const detalhe = document.createElement('span');
      detalhe.className = 'item-habito-detalhe';
      detalhe.textContent = descricao.detalhe;
      texto.appendChild(detalhe);
    }

    const categoria = document.createElement('span');
    categoria.className = 'chip';
    categoria.textContent = habito.categoria;

    item.append(caixa, texto, categoria);
    lista.appendChild(item);
  });
}