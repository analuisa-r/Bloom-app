// diario.js
// Tela do diário: desenha a página e reage aos cliques.
// Regras e dados ficam em dados.js; funções de tela em interface.js.

// Id da entrada que está sendo editada (null = criando uma nova).
let idEmEdicao = null;

function lerHumorEscolhido() {
  const escolhido = document.querySelector('input[name="humor"]:checked');

  return escolhido ? escolhido.value : '';
}

// ---------- Formulário (criar e editar) ----------

function desenharOpcoesDeHumor() {
  const grupo = elemento('humores');

  HUMORES.forEach(function (humor) {
    const rotulo = document.createElement('label');
    rotulo.className = 'humor';

    const opcao = document.createElement('input');
    opcao.type = 'radio';
    opcao.name = 'humor';
    opcao.value = humor;

    rotulo.append(opcao, humor);
    grupo.appendChild(rotulo);
  });
}

function prepararFormularioParaCriar() {
  idEmEdicao = null;

  elemento('form-diario').reset();
  elemento('campo-data').max = dataDeHoje();
  elemento('campo-data').value = dataDeHoje();
  elemento('rotulo-form').textContent = 'Novo registro';
  elemento('titulo-form').textContent = 'Como foi o seu dia?';
  elemento('botao-salvar').textContent = 'Salvar registro';
  elemento('botao-cancelar').hidden = true;
}

function prepararFormularioParaEditar(entrada) {
  idEmEdicao = entrada.id;

  elemento('campo-data').value = entrada.data;
  elemento('campo-texto').value = entrada.texto;

  document.querySelectorAll('input[name="humor"]').forEach(function (opcao) {
    opcao.checked = opcao.value === entrada.humor;
  });

  elemento('rotulo-form').textContent = 'Editando';
  elemento('titulo-form').textContent = 'Ajustar registro';
  elemento('botao-salvar').textContent = 'Salvar alterações';
  elemento('botao-cancelar').hidden = false;

  elemento('campo-texto').focus();
}

// ---------- Desenho da tela ----------

function desenharLista() {
  const entradas = listarDiarioOrdenado();
  const lista = elemento('lista-diario');

  lista.innerHTML = '';

  entradas.forEach(function (entrada) {
    const item = document.createElement('li');
    item.className = 'entrada';

    const topo = document.createElement('div');
    topo.className = 'entrada-topo';

    const data = document.createElement('strong');
    data.className = 'entrada-data';
    data.textContent = formatarDataLonga(entrada.data);

    const humor = document.createElement('small');
    humor.className = 'entrada-humor';
    humor.textContent = entrada.humor;

    topo.append(data, humor);

    const texto = document.createElement('p');
    texto.className = 'entrada-texto';
    texto.textContent = entrada.texto;

    const acoes = document.createElement('div');
    acoes.className = 'entrada-acoes';

    const botaoEditar = document.createElement('button');
    botaoEditar.type = 'button';
    botaoEditar.textContent = 'Editar';
    botaoEditar.className = 'botao-pequeno';

    botaoEditar.addEventListener('click', function () {
      prepararFormularioParaEditar(entrada);
    });

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.className = 'botao-pequeno botao-perigo';

    botaoExcluir.addEventListener('click', function () {
      if (confirm('Excluir o registro de ' + formatarDataLonga(entrada.data) + '?')) {
        excluirEntradaDeDiario(entrada.id);

        if (idEmEdicao === entrada.id) {
          prepararFormularioParaCriar();
        }

        mostrarMensagem('Registro excluído.', 'sucesso');
        desenharLista();
      }
    });

    acoes.append(botaoEditar, botaoExcluir);
    item.append(topo, texto, acoes);
    lista.appendChild(item);
  });

  elemento('lista-vazia').hidden = entradas.length > 0;
}

// ---------- Eventos ----------

elemento('form-diario').addEventListener('submit', function (evento) {
  evento.preventDefault();

  const data = elemento('campo-data').value;
  const humor = lerHumorEscolhido();
  const texto = elemento('campo-texto').value;

  const editando = idEmEdicao !== null;

  const erro = editando
    ? editarEntradaDeDiario(idEmEdicao, data, humor, texto)
    : criarEntradaDeDiario(data, humor, texto);

  if (erro !== '') {
    mostrarMensagem(erro, 'erro');
    return;
  }

  mostrarMensagem(editando ? 'Registro atualizado.' : 'Registro salvo!', 'sucesso');
  prepararFormularioParaCriar();
  desenharLista();
});

elemento('botao-cancelar').addEventListener('click', function () {
  prepararFormularioParaCriar();
});

desenharOpcoesDeHumor();
prepararFormularioParaCriar();
desenharLista();