// habitos.js
// Tela de hábitos: desenha a página e reage aos cliques.

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

// ---------- Desenho da tela ----------

function desenharSaudacao() {
  const nome = lerNome();

  elemento('form-nome').hidden = nome !== '';
  elemento('painel').hidden = nome === '';

  elemento('saudacao').textContent = nome
    ? 'Olá, ' + nome + '!'
    : 'Bem-vinda ao Bloom';

  elemento('data-hoje').textContent = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

function desenharEnergia() {
  const registrada = lerEnergiaDeHoje();

  document.querySelectorAll('.botao-energia').forEach(function (botao) {
    const selecionado = botao.dataset.nivel === registrada;

    botao.classList.toggle('botao-energia-ativo', selecionado);
    botao.setAttribute('aria-pressed', String(selecionado));
  });

  const textos = {
    baixa: 'Hoje o Bloom mostra a versão leve dos seus hábitos. Fazer o pouco também conta.',
    média: 'Um dia de ritmo normal. Siga no seu tempo.',
    alta: 'Dia de energia boa! Aproveite para avançar nos seus hábitos.'
  };

  elemento('energia-texto').textContent = registrada
    ? textos[registrada]
    : 'Você ainda não registrou sua energia hoje. Enquanto isso, o Bloom considera energia média.';
}

function desenharLista() {
  const habitos = listarHabitos();
  const concluidos = listarConcluidosDeHoje();
  const lista = elemento('lista-habitos');

  lista.innerHTML = '';

  habitos.forEach(function (habito) {
    const registro = concluidos.find(function (item) {
      return item.id === habito.id;
    });

    const feito = Boolean(registro);

    // Se já concluiu, mostra a versão que foi feita; senão, a do momento.
    const modoMinimo = feito
      ? registro.versao === 'mínima'
      : usarVersaoMinima(habito);

    const item = document.createElement('li');
    item.className = 'habito' + (feito ? ' habito-feito' : '');

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.checked = feito;
    caixa.setAttribute('aria-label', 'Concluir ' + habito.nome);

    caixa.addEventListener('change', function () {
      alternarConclusao(habito.id);
      desenharTudo();
    });

    const texto = document.createElement('span');
    texto.className = 'habito-nome';
    texto.textContent = modoMinimo
      ? habito.versaoMinima
      : habito.nome;

    const etiqueta = document.createElement('small');
    etiqueta.textContent = feito
      ? 'Versão ' + registro.versao
      : modoMinimo
        ? 'Versão leve'
        : habito.categoria;

    const botaoEditar = document.createElement('button');
    botaoEditar.textContent = 'Editar';
    botaoEditar.className = 'botao-pequeno';

    botaoEditar.addEventListener('click', function () {
      const novoNome = prompt('Nome do hábito:', habito.nome);

      if (novoNome === null || novoNome.trim().length < 2) {
        return;
      }

      const novaCategoria = prompt(
        'Categoria (' + CATEGORIAS.join(', ') + '):',
        habito.categoria
      );

      if (novaCategoria === null) {
        return;
      }

      const novaVersao = prompt(
        'Versão mínima (deixe vazio se não quiser):',
        habito.versaoMinima || ''
      );

      if (novaVersao === null) {
        return;
      }

      const atualizado = editarHabito(
        habito.id,
        novoNome,
        novaCategoria,
        novaVersao
      );

      if (!atualizado) {
        mostrarMensagem('Verifique o nome e a categoria.', 'erro');
        return;
      }

      mostrarMensagem('Hábito atualizado.', 'sucesso');
      desenharTudo();
    });

    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.className = 'botao-pequeno botao-perigo';

    botaoExcluir.addEventListener('click', function () {
      if (confirm('Excluir o hábito "' + habito.nome + '"?')) {
        excluirHabito(habito.id);
        mostrarMensagem('Hábito excluído.', 'sucesso');
        desenharTudo();
      }
    });

    item.append(caixa, texto, etiqueta, botaoEditar, botaoExcluir);
    lista.appendChild(item);
  });

  elemento('lista-vazia').hidden = habitos.length > 0;
}

function desenharProgresso() {
  const progresso = calcularProgressoDeHoje();

  elemento('progresso-texto').textContent =
    progresso.feitos + ' de ' + progresso.total + ' hábitos concluídos hoje';

  elemento('progresso-barra').style.width = progresso.porcentagem + '%';
}

function desenharTudo() {
  desenharSaudacao();
  desenharEnergia();
  desenharLista();
  desenharProgresso();
}

// ---------- Eventos ----------

elemento('form-nome').addEventListener('submit', function (evento) {
  evento.preventDefault();

  if (!salvarNome(elemento('campo-nome').value)) {
    mostrarMensagem('Digite um nome com pelo menos 2 letras.', 'erro');
    return;
  }

  desenharTudo();
});

document.querySelectorAll('.botao-energia').forEach(function (botao) {
  botao.addEventListener('click', function () {
    if (!salvarEnergiaDeHoje(botao.dataset.nivel)) {
      mostrarMensagem('Nível de energia inválido.', 'erro');
      return;
    }

    desenharTudo();
  });
});

elemento('form-habito').addEventListener('submit', function (evento) {
  evento.preventDefault();

  const nome = elemento('campo-habito').value;
  const categoria = elemento('campo-categoria').value;
  const versaoMinima = elemento('campo-minima').value;

  if (!criarHabito(nome, categoria, versaoMinima)) {
    mostrarMensagem('Verifique o nome e a categoria do hábito.', 'erro');
    return;
  }

  elemento('campo-habito').value = '';
  elemento('campo-minima').value = '';

  mostrarMensagem('Hábito criado!', 'sucesso');
  desenharTudo();
});

CATEGORIAS.forEach(function (categoria) {
  const opcao = document.createElement('option');

  opcao.value = categoria;
  opcao.textContent = categoria;

  elemento('campo-categoria').appendChild(opcao);
});

desenharTudo();