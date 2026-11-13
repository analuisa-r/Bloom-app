// meu-dia.js
// Tela "Meu dia": saudação, check-in de energia e jardim.
// Regras e dados ficam em dados.js (carregado antes deste arquivo).

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
  const titulo = elemento('saudacao');

  elemento('form-nome').hidden = nome !== '';
  elemento('painel').hidden = nome === '';

  titulo.textContent = saudacaoPorHora(new Date().getHours());

  if (nome !== '') {
    const destaque = document.createElement('em');
    destaque.textContent = nome;
    titulo.append(', ', destaque);
  }

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
    : 'Escolha a flor que mais combina com você agora.';

  // O botão para a página de hábitos só aparece depois do check-in.
  elemento('ir-habitos').hidden = registrada === null;
}

function desenharJardim() {
  const progresso = calcularProgressoDeHoje();
  const floridas = estagioDoJardim(progresso.porcentagem);

  elemento('jardim-percentual').textContent = progresso.porcentagem + '%';

  elemento('jardim-texto').textContent = progresso.total === 0
    ? 'Você ainda não tem hábitos. Plante o primeiro na página Hábitos.'
    : progresso.feitos + ' de ' + progresso.total + ' hábitos cuidados hoje';

  const jardim = elemento('jardim');

  jardim.setAttribute(
    'aria-label',
    'Jardim com ' + floridas + ' de ' + PLANTAS_NO_JARDIM + ' plantas floridas'
  );

  jardim.querySelectorAll('.planta').forEach(function (planta, indice) {
    planta.classList.toggle('planta-florida', indice < floridas);
  });
}

function desenharTudo() {
  desenharSaudacao();
  desenharEnergia();
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

document.querySelectorAll('.botao-energia').forEach(function (botao) {
  botao.addEventListener('click', function () {
    if (!salvarEnergiaDeHoje(botao.dataset.nivel)) {
      mostrarMensagem('Nível de energia inválido.', 'erro');
      return;
    }

    desenharTudo();
  });
});

desenharTudo();