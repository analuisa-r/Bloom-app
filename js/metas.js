// metas.js
// Tela de metas: lista, andamento, cadastro, edição e exclusão.
// Regras e dados em dados.js; funções de tela em interface.js.

// Id da meta que está sendo editada (null = criando uma meta nova).
let idEmEdicao = null;

function formatarDataParaExibir(dataAlvo) {
  return new Date(dataAlvo + 'T00:00:00').toLocaleDateString('pt-BR');
}

function descreverPrazo(meta) {
  const dias = diasAteOPrazo(meta.dataAlvo);
  const data = formatarDataParaExibir(meta.dataAlvo);

  if (meta.concluida) {
    return 'Prazo: ' + data;
  }

  if (dias < 0) {
    return 'Prazo: ' + data + ' · você pode ajustar a data quando quiser';
  }

  if (dias === 0) {
    return 'Prazo: hoje (' + data + ')';
  }

  return 'Prazo: ' + data + ' · ' + textoFaltamDias(dias);
}

// ---------- Formulário (criar e editar) ----------

function prepararFormularioParaCriar() {
  idEmEdicao = null;

  elemento('form-meta').reset();
  elemento('campo-prazo').min = dataDeHoje();
  elemento('titulo-form').textContent = 'Plantar uma meta';
  elemento('botao-salvar').textContent = 'Adicionar meta';
  elemento('botao-cancelar').hidden = true;
}

function prepararFormularioParaEditar(meta) {
  idEmEdicao = meta.id;

  elemento('campo-titulo').value = meta.titulo;
  elemento('campo-descricao').value = meta.descricao;
  elemento('campo-prazo').min = meta.criadaEm;
  elemento('campo-prazo').value = meta.dataAlvo;
  elemento('campo-andamento').value = String(meta.andamento || 0);
  elemento('titulo-form').textContent = 'Ajustar meta';
  elemento('botao-salvar').textContent = 'Salvar alterações';
  elemento('botao-cancelar').hidden = false;

  elemento('campo-titulo').focus();
}

// ---------- Desenho da tela ----------

function desenharResumo() {
  const resumo = calcularResumoDeMetas();

  elemento('resumo-percentual').textContent = resumo.porcentagem + '%';
  elemento('resumo-preenchido').style.width = resumo.porcentagem + '%';
  elemento('resumo-barra').setAttribute('aria-valuenow', String(resumo.porcentagem));

  elemento('resumo-texto').textContent = resumo.total === 0
    ? 'Nenhuma meta ainda.'
    : textoMetasConcluidas(resumo.concluidas, resumo.total);
}

function criarBarraDeAndamento(meta) {
  const andamento = andamentoDaMeta(meta);

  const linha = document.createElement('div');
  linha.className = 'meta-andamento';

  const barra = document.createElement('div');
  barra.className = 'barra';
  barra.setAttribute('role', 'progressbar');
  barra.setAttribute('aria-label', 'Andamento da meta ' + meta.titulo);
  barra.setAttribute('aria-valuemin', '0');
  barra.setAttribute('aria-valuemax', '100');
  barra.setAttribute('aria-valuenow', String(andamento));

  const preenchimento = document.createElement('div');
  preenchimento.className = 'barra-preenchida';
  preenchimento.style.width = andamento + '%';
  barra.appendChild(preenchimento);

  const texto = document.createElement('span');
  texto.className = 'meta-andamento-texto';
  texto.textContent = andamento + '%';

  linha.append(barra, texto);

  return linha;
}

function excluirComConfirmacao(meta) {
  if (!confirm('Excluir a meta "' + meta.titulo + '"?')) {
    return;
  }

  excluirMeta(meta.id);

  if (idEmEdicao === meta.id) {
    prepararFormularioParaCriar();
  }

  mostrarMensagem('Meta excluída.', 'sucesso');
  desenharTudo();
}

function desenharLista() {
  const metas = listarMetas();
  const lista = elemento('lista-metas');

  lista.replaceChildren();

  metas.forEach(function (meta, indice) {
    const situacao = situacaoDaMeta(meta);

    const item = document.createElement('li');
    item.className = 'item-habito' + (meta.concluida ? ' item-habito-feito' : '');

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.className = 'caixa';
    caixa.id = 'meta-' + indice;
    caixa.checked = meta.concluida;

    caixa.addEventListener('change', function () {
      alternarMetaConcluida(meta.id);
      desenharTudo();
    });

    const texto = document.createElement('div');
    texto.className = 'item-habito-texto';

    const titulo = document.createElement('label');
    titulo.className = 'item-habito-nome';
    titulo.htmlFor = caixa.id;
    titulo.textContent = meta.titulo;
    texto.appendChild(titulo);

    if (meta.descricao !== '') {
      const descricao = document.createElement('span');
      descricao.className = 'meta-descricao';
      descricao.textContent = meta.descricao;
      texto.appendChild(descricao);
    }

    const prazo = document.createElement('span');
    prazo.className = 'meta-prazo';
    prazo.textContent = descreverPrazo(meta);
    texto.append(prazo, criarBarraDeAndamento(meta));

    const etiqueta = document.createElement('span');
    etiqueta.className = 'chip';
    etiqueta.textContent = situacao.charAt(0).toUpperCase() + situacao.slice(1);

    const acoes = document.createElement('div');
    acoes.className = 'item-habito-acoes';

    acoes.append(
      criarBotaoDaLista('Editar', 'botao botao-secundario botao-pequeno', 'Editar ' + meta.titulo,
        function () { prepararFormularioParaEditar(meta); }),
      criarBotaoDaLista('Excluir', 'botao botao-perigo botao-pequeno', 'Excluir ' + meta.titulo,
        function () { excluirComConfirmacao(meta); })
    );

    item.append(caixa, texto, etiqueta, acoes);
    lista.appendChild(item);
  });

  elemento('lista-vazia').hidden = metas.length > 0;
}

function desenharTudo() {
  desenharResumo();
  desenharLista();
}

// ---------- Eventos ----------

elemento('form-meta').addEventListener('submit', function (evento) {
  evento.preventDefault();

  const titulo = elemento('campo-titulo').value;
  const descricao = elemento('campo-descricao').value;
  const prazo = elemento('campo-prazo').value;
  const andamento = elemento('campo-andamento').value;

  const editando = idEmEdicao !== null;

  const erro = editando
    ? editarMeta(idEmEdicao, titulo, descricao, prazo, andamento)
    : criarMeta(titulo, descricao, prazo, andamento);

  if (erro !== '') {
    mostrarMensagem(erro, 'erro');
    return;
  }

  mostrarMensagem(editando ? 'Meta atualizada.' : 'Meta criada!', 'sucesso');
  prepararFormularioParaCriar();
  desenharTudo();
});

elemento('botao-cancelar').addEventListener('click', prepararFormularioParaCriar);

ANDAMENTOS_DA_META.forEach(function (valor) {
  const opcao = document.createElement('option');

  opcao.value = String(valor);
  opcao.textContent = valor + '%';

  elemento('campo-andamento').appendChild(opcao);
});

prepararFormularioParaCriar();
desenharTudo();