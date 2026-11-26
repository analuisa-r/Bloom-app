// habitos.js
// Tela de hábitos: lista, cadastro, edição e exclusão.
// Regras e dados em dados.js; lista em lista-habitos.js; funções de tela em interface.js.

// Id do hábito que está sendo editado (null = criando um hábito novo).
let idEmEdicao = null;

// ---------- Formulário (criar e editar) ----------

function prepararFormularioParaCriar() {
  idEmEdicao = null;

  elemento('form-habito').reset();
  elemento('titulo-form').textContent = 'Plantar uma semente';
  elemento('botao-salvar').textContent = 'Adicionar hábito';
  elemento('botao-cancelar').hidden = true;
}

function prepararFormularioParaEditar(habito) {
  idEmEdicao = habito.id;

  elemento('campo-habito').value = habito.nome;
  elemento('campo-categoria').value = habito.categoria;
  elemento('campo-minima').value = habito.versaoMinima || '';
  elemento('titulo-form').textContent = 'Ajustar hábito';
  elemento('botao-salvar').textContent = 'Salvar alterações';
  elemento('botao-cancelar').hidden = false;

  elemento('campo-habito').focus();
}

// ---------- Desenho da tela ----------

function desenharEnergia() {
  const registrada = lerEnergiaDeHoje();

  elemento('energia-aviso').textContent = registrada
    ? TEXTOS.energia[registrada].aviso
    : TEXTOS.energia.semRegistro;
}

function excluirComConfirmacao(habito) {
  if (!confirm('Excluir o hábito "' + habito.nome + '"?')) {
    return;
  }

  excluirHabito(habito.id);

  if (idEmEdicao === habito.id) {
    prepararFormularioParaCriar();
  }

  mostrarMensagem('Hábito excluído.', 'sucesso');
  desenharLista();
}

function desenharLista() {
  const total = listarHabitos().length;

  desenharChecklistDeHoje(elemento('lista-habitos'), {
    aoMudar: desenharLista,
    aoEditar: prepararFormularioParaEditar,
    aoExcluir: excluirComConfirmacao,
    mostrarConstancia: true
  });

  elemento('lista-vazia').hidden = total > 0;
  elemento('contagem').textContent = total === 0 ? '' : pluralizar(total, 'hábito', 'hábitos');
}

function desenharTudo() {
  desenharEnergia();
  desenharLista();
}

// ---------- Eventos ----------

elemento('form-habito').addEventListener('submit', function (evento) {
  evento.preventDefault();

  const nome = elemento('campo-habito').value;
  const categoria = elemento('campo-categoria').value;
  const versaoMinima = elemento('campo-minima').value;

  const editando = idEmEdicao !== null;

  const erro = editando
    ? editarHabito(idEmEdicao, nome, categoria, versaoMinima)
    : criarHabito(nome, categoria, versaoMinima);

  if (erro !== '') {
    mostrarMensagem(erro, 'erro');
    return;
  }

  mostrarMensagem(editando ? 'Hábito atualizado.' : 'Hábito criado!', 'sucesso');
  prepararFormularioParaCriar();
  desenharLista();
});

elemento('botao-cancelar').addEventListener('click', prepararFormularioParaCriar);

CATEGORIAS.forEach(function (categoria) {
  const opcao = document.createElement('option');

  opcao.value = categoria;
  opcao.textContent = categoria;

  elemento('campo-categoria').appendChild(opcao);
});

// Quando a energia muda pela pílula do cabeçalho ou por outra tela, a página se redesenha.
document.addEventListener('energia-alterada', desenharTudo);

prepararFormularioParaCriar();
desenharTudo();