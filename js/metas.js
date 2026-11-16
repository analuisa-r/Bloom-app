// metas.js
// Tela de metas: desenha a página e reage aos cliques.
// Regras e dados ficam em dados.js (carregado antes deste arquivo).

const elemento = function (id) {
  return document.getElementById(id);
};

// Id da meta que está sendo editada (null = criando uma meta nova).
let idEmEdicao = null;

function mostrarMensagem(texto, tipo) {
  const caixa = elemento('mensagem');

  caixa.textContent = texto;
  caixa.className = 'mensagem mensagem-' + tipo;

  setTimeout(function () {
    caixa.className = 'mensagem';
    caixa.textContent = '';
  }, 3000);
}

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

  return 'Prazo: ' + data + ' · faltam ' + dias + (dias === 1 ? ' dia' : ' dias');
}

// ---------- Formulário (criar e editar) ----------

function prepararFormularioParaCriar() {
  idEmEdicao = null;

  elemento('form-meta').reset();
  elemento('campo-prazo').min = dataDeHoje();
  elemento('rotulo-form').textContent = 'Nova meta';
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
  elemento('rotulo-form').textContent = 'Editando';
  elemento('titulo-form').textContent = 'Ajustar meta';
  elemento('botao-salvar').textContent = 'Salvar alterações';
  elemento('botao-cancelar').hidden = false;

  elemento('campo-titulo').focus();
}

// ---------- Desenho da tela ----------

function desenharResumo() {
  const resumo = calcularResumoDeMetas();

  elemento('resumo-texto').textContent =
    resumo.concluidas + ' de ' + resumo.total + ' metas concluídas';

  elemento('progresso-barra').style.width = resumo.porcentagem + '%';
}

function desenharLista() {
  const metas = listarMetas();
  const lista = elemento('lista-metas');

  lista.innerHTML = '';

  metas.forEach(function (meta) {
    const situacao = situacaoDaMeta(meta);

    const item = document.createElement('li');
    item.className = 'habito' + (meta.concluida ? ' habito-feito' : '');

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.checked = meta.concluida;
    caixa.setAttribute('aria-label', 'Concluir meta ' + meta.titulo);

    caixa.addEventListener('change', function () {
      alternarMetaConcluida(meta.id);
      desenharTudo();
    });

    const texto = document.createElement('div');
    texto.className = 'meta-texto';

    const titulo = document.createElement('strong');
    titulo.className = 'meta-titulo';
    titulo.textContent = meta.titulo;
    texto.appendChild(titulo);

    if (meta.descricao !== '') {
      const descricao = document.createElement('p');
      descricao.className = 'meta-descricao';
      descricao.textContent = meta.descricao;
      texto.appendChild(descricao);
    }

    const prazo = document.createElement('p');
    prazo.className = 'meta-prazo';
    prazo.textContent = descreverPrazo(meta);
    texto.appendChild(prazo);

    const etiqueta = document.createElement('small');
    etiqueta.textContent = situacao.charAt(0).toUpperCase() + situacao.slice(1);

    const botaoEditar = document.createElement('button');
    botaoEditar.type = 'button';
    botaoEditar.textContent = 'Editar';
    botaoEditar.className = 'botao-pequeno';

    botaoEditar.addEventListener('click', function () {
      prepararFormularioParaEditar(meta);
    });

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.className = 'botao-pequeno botao-perigo';

    botaoExcluir.addEventListener('click', function () {
      if (confirm('Excluir a meta "' + meta.titulo + '"?')) {
        excluirMeta(meta.id);

        if (idEmEdicao === meta.id) {
          prepararFormularioParaCriar();
        }

        mostrarMensagem('Meta excluída.', 'sucesso');
        desenharTudo();
      }
    });

    item.append(caixa, texto, etiqueta, botaoEditar, botaoExcluir);
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

  const editando = idEmEdicao !== null;

  const erro = editando
    ? editarMeta(idEmEdicao, titulo, descricao, prazo)
    : criarMeta(titulo, descricao, prazo);

  if (erro !== '') {
    mostrarMensagem(erro, 'erro');
    return;
  }

  mostrarMensagem(editando ? 'Meta atualizada.' : 'Meta criada!', 'sucesso');
  prepararFormularioParaCriar();
  desenharTudo();
});

elemento('botao-cancelar').addEventListener('click', function () {
  prepararFormularioParaCriar();
});

prepararFormularioParaCriar();
desenharTudo();