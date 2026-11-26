// meu-dia.js
// Tela "Meu dia": saudação, energia, hábitos de hoje e jardim.
// Regras em dados.js; cabeçalho em cabecalho.js; textos em textos.js.

// ---------- Desenho da tela ----------

function desenharSaudacao() {
  const nome = lerNome();
  const titulo = elemento('saudacao');

  elemento('form-nome').hidden = nome !== '';
  elemento('painel').hidden = nome === '';

  titulo.textContent = saudacaoPorHora(new Date().getHours());

  if (nome !== '') {
    const destaque = document.createElement('em');
    destaque.textContent = nome;
    titulo.append(', ', destaque);
  }

  elemento('data-hoje').textContent = formatarDataLonga(dataDeHoje());
}

function desenharEnergia() {
  const registrada = lerEnergiaDeHoje();

  document.querySelectorAll('.energia-opcoes .opcao').forEach(function (botao) {
    botao.setAttribute('aria-pressed', String(botao.dataset.nivel === registrada));
  });

  elemento('energia-aviso').textContent = registrada
    ? TEXTOS.energia[registrada].aviso
    : TEXTOS.energia.semRegistro;
}

function desenharHabitosDeHoje() {
  desenharChecklistDeHoje(elemento('lista-habitos'), { aoMudar: desenharTudo });
  elemento('lista-vazia').hidden = listarHabitos().length > 0;
}

function desenharJardim() {
  const progresso = calcularProgressoDeHoje();
  const jardim = montarJardim();
  const lista = elemento('jardim');

  elemento('jardim-percentual').textContent = progresso.porcentagem + '%';
  elemento('jardim-preenchido').style.width = progresso.porcentagem + '%';
  elemento('jardim-barra').setAttribute('aria-valuenow', String(progresso.porcentagem));

  elemento('jardim-texto').textContent = progresso.total === 0
    ? 'Seu jardim ainda não tem plantas. Cada hábito vira uma planta.'
    : textoHabitosCuidados(progresso.feitos, progresso.total);

  lista.replaceChildren();

  jardim.plantas.forEach(function (planta) {
    const item = document.createElement('li');
    const situacao = planta.florida ? 'florida' : 'em broto';

    item.append(
      criarSvg('..', planta.florida ? 'flor-florida' : 'flor-botao', 'ilustracao', 48, 72)
    );

    const descricao = document.createElement('span');
    descricao.className = 'visualmente-oculto';
    descricao.textContent = planta.nome + ': ' + situacao;
    item.appendChild(descricao);

    lista.appendChild(item);
  });

  if (jardim.excedentes > 0) {
    const mais = document.createElement('li');
    mais.className = 'jardim-mais';
    mais.textContent = '+' + jardim.excedentes;
    lista.appendChild(mais);
  }
}

function desenharTudo() {
  desenharSaudacao();
  desenharEnergia();
  desenharHabitosDeHoje();
  desenharJardim();
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

document.querySelectorAll('.energia-opcoes .opcao').forEach(function (botao) {
  botao.addEventListener('click', function () {
    if (!registrarEnergia(botao.dataset.nivel)) {
      mostrarMensagem('Não foi possível salvar a energia. Verifique o espaço do navegador.', 'erro');
    }
  });
});

// Quando a energia muda (aqui ou na pílula do cabeçalho), a tela se redesenha.
document.addEventListener('energia-alterada', desenharTudo);

desenharTudo();