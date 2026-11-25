// habitos.js
// Tela de hábitos: desenha a página e reage aos cliques.
// Regras e dados ficam em dados.js; funções de tela em interface.js.

const ROTULOS_DE_ENERGIA = {
  baixa: 'Baixa · Em botão',
  média: 'Média · Abrindo',
  alta: 'Alta · Florida'
};

const AVISOS_DE_ENERGIA = {
  baixa: 'Hoje o Bloom mostra a versão leve dos seus hábitos. Fazer o pouco também conta.',
  média: 'Um dia de ritmo normal. Siga no seu tempo.',
  alta: 'Dia de energia boa! Aproveite para avançar nos seus hábitos.'
};

// ---------- Desenho da tela ----------

function desenharEnergia() {
  const registrada = lerEnergiaDeHoje();

  elemento('energia-atual').textContent = registrada
    ? ROTULOS_DE_ENERGIA[registrada]
    : 'ainda não registrada';

  elemento('link-energia').textContent = registrada ? 'mudar' : 'registrar';

  elemento('aviso-energia').textContent = registrada
    ? AVISOS_DE_ENERGIA[registrada]
    : 'Você ainda não registrou sua energia hoje. Enquanto isso, o Bloom considera energia média.';
}

function montarDetalheDoHabito(habito, registro, modoMinimo) {
  const partes = [];

  if (registro && registro.versao === 'mínima') {
    partes.push('Concluído na versão mínima');
  } else if (modoMinimo) {
    partes.push('Versão completa: ' + habito.nome);
  } else if ((habito.versaoMinima || '') !== '') {
    partes.push('Versão mínima: ' + habito.versaoMinima);
  }

  partes.push('Constância: ' + calcularConstancia(habito.id) + '%');

  return partes.join(' · ');
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
      desenharLista();
    });

    const texto = document.createElement('div');
    texto.className = 'habito-nome';

    const principal = document.createElement('strong');
    principal.textContent = modoMinimo ? habito.versaoMinima : habito.nome;

    const detalhe = document.createElement('span');
    detalhe.className = 'habito-detalhe';
    detalhe.textContent = montarDetalheDoHabito(habito, registro, modoMinimo);

    texto.append(principal, detalhe);

    const etiqueta = document.createElement('small');
    etiqueta.textContent = habito.categoria;

    const botaoEditar = document.createElement('button');
    botaoEditar.type = 'button';
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

      if (!editarHabito(habito.id, novoNome, novaCategoria, novaVersao)) {
        mostrarMensagem('Verifique o nome e a categoria.', 'erro');
        return;
      }

      mostrarMensagem('Hábito atualizado.', 'sucesso');
      desenharLista();
    });

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.className = 'botao-pequeno botao-perigo';

    botaoExcluir.addEventListener('click', function () {
      if (confirm('Excluir o hábito "' + habito.nome + '"?')) {
        excluirHabito(habito.id);
        mostrarMensagem('Hábito excluído.', 'sucesso');
        desenharLista();
      }
    });

    item.append(caixa, texto, etiqueta, botaoEditar, botaoExcluir);
    lista.appendChild(item);
  });

  elemento('lista-vazia').hidden = habitos.length > 0;
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

  if (!criarHabito(nome, categoria, versaoMinima)) {
    mostrarMensagem('Verifique o nome e a categoria do hábito.', 'erro');
    return;
  }

  elemento('campo-habito').value = '';
  elemento('campo-minima').value = '';

  mostrarMensagem('Hábito criado!', 'sucesso');
  desenharLista();
});

CATEGORIAS.forEach(function (categoria) {
  const opcao = document.createElement('option');

  opcao.value = categoria;
  opcao.textContent = categoria;

  elemento('campo-categoria').appendChild(opcao);
});

desenharTudo();

// Quando a energia muda pela pílula do cabeçalho, a tela se redesenha.
document.addEventListener('energia-alterada', desenharTudo);