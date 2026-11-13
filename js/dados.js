// dados.js
// Regras de negócio e acesso aos dados do Bloom.
// Este arquivo NÃO mexe na tela (nada de "document" aqui).
// Depende de storage.js (objeto "armazenamento").

const CATEGORIAS = ['Estudos', 'Autocuidado', 'Organização', 'Bem-estar'];
const NIVEIS_ENERGIA = ['baixa', 'média', 'alta'];
const ENERGIA_PADRAO = 'média'; // RN05: sem check-in, considera energia média
const DIAS_CONSTANCIA = 30;

// ---------- Datas ----------

function formatarData(data) {
  return data.toLocaleDateString('sv-SE'); // formato AAAA-MM-DD
}

function dataDeHoje() {
  return formatarData(new Date());
}

// ---------- Nome ----------

function lerNome() {
  return armazenamento.ler('nome', '');
}

function salvarNome(nome) {
  const nomeValido = nome.trim();

  if (nomeValido.length < 2) {
    return false;
  }

  armazenamento.salvar('nome', nomeValido);
  return true;
}

// ---------- Hábitos e registros ----------

function listarHabitos() {
  return armazenamento.ler('habitos', []);
}

function listarRegistros() {
  return armazenamento.ler('registros', {});
}

function listarConcluidosDeHoje() {
  const registros = listarRegistros();
  return registros[dataDeHoje()] || [];
}

function salvarConcluidosDeHoje(registrosDeHoje) {
  const registros = listarRegistros();
  registros[dataDeHoje()] = registrosDeHoje;
  armazenamento.salvar('registros', registros);
}

// ---------- Energia ----------

function lerEnergiaDeHoje() {
  const energias = armazenamento.ler('energias', {});
  return energias[dataDeHoje()] || null;
}

function salvarEnergiaDeHoje(nivel) {
  if (!NIVEIS_ENERGIA.includes(nivel)) {
    return false;
  }

  const energias = armazenamento.ler('energias', {});
  energias[dataDeHoje()] = nivel;
  armazenamento.salvar('energias', energias);

  return true;
}

function energiaConsiderada() {
  return lerEnergiaDeHoje() || ENERGIA_PADRAO;
}

// RN03: energia baixa + hábito com versão mínima => apresenta a versão mínima.
// O "|| ''" protege hábitos antigos, criados sem esse campo.
function usarVersaoMinima(habito) {
  const versaoMinima = habito.versaoMinima || '';

  return energiaConsiderada() === 'baixa' &&
    versaoMinima.trim() !== '';
}

// ---------- Ações sobre hábitos ----------

function criarHabito(nome, categoria, versaoMinima) {
  const nomeValido = nome.trim();

  if (nomeValido.length < 2) {
    return false;
  }

  if (!CATEGORIAS.includes(categoria)) {
    return false;
  }

  const habitos = listarHabitos();

  habitos.push({
    id: Date.now() + Math.random(),
    nome: nomeValido,
    categoria: categoria,
    versaoMinima: versaoMinima.trim()
  });

  armazenamento.salvar('habitos', habitos);

  return true;
}

function editarHabito(id, novoNome, novaCategoria, novaVersaoMinima) {
  const nomeValido = novoNome.trim();

  if (nomeValido.length < 2 || !CATEGORIAS.includes(novaCategoria)) {
    return false;
  }

  const habitos = listarHabitos();
  const indice = habitos.findIndex(function (habito) {
    return habito.id === id;
  });

  if (indice === -1) {
    return false;
  }

  habitos[indice] = {
    ...habitos[indice],
    nome: nomeValido,
    categoria: novaCategoria,
    versaoMinima: novaVersaoMinima.trim()
  };

  armazenamento.salvar('habitos', habitos);

  return true;
}

function excluirHabito(id) {
  const habitos = listarHabitos().filter(function (habito) {
    return habito.id !== id;
  });

  armazenamento.salvar('habitos', habitos);

  // Remove o hábito dos registros de todas as datas.
  const registros = listarRegistros();

  Object.keys(registros).forEach(function (data) {
    registros[data] = registros[data].filter(function (registro) {
      return registro.id !== id;
    });
  });

  armazenamento.salvar('registros', registros);
}

function alternarConclusao(id) {
  const concluidos = listarConcluidosDeHoje();

  const jaConcluido = concluidos.some(function (registro) {
    return registro.id === id;
  });

  if (jaConcluido) {
    salvarConcluidosDeHoje(concluidos.filter(function (registro) {
      return registro.id !== id;
    }));
    return;
  }

  const habito = listarHabitos().find(function (item) {
    return item.id === id;
  }) || { versaoMinima: '' };

  // RN04: concluir a versão mínima conta como hábito concluído.
  const versao = usarVersaoMinima(habito) ? 'mínima' : 'completa';

  salvarConcluidosDeHoje(concluidos.concat({ id: id, versao: versao }));
}

// ---------- Cálculos ----------

// RN06: constância = dias concluídos nos últimos 30 dias / 30, em porcentagem.
// Dias sem conclusão não zeram nada, só reduzem a porcentagem.
function calcularConstancia(idHabito) {
  const registros = listarRegistros();
  let diasConcluidos = 0;

  for (let i = 0; i < DIAS_CONSTANCIA; i++) {
    const dia = new Date();
    dia.setDate(dia.getDate() - i);

    const registrosDoDia = registros[formatarData(dia)] || [];

    const concluiuNoDia = registrosDoDia.some(function (registro) {
      return registro.id === idHabito;
    });

    if (concluiuNoDia) {
      diasConcluidos++;
    }
  }

  return Math.round((diasConcluidos / DIAS_CONSTANCIA) * 100);
}

function calcularProgressoDeHoje() {
  const total = listarHabitos().length;
  const feitos = listarConcluidosDeHoje().length;
  const porcentagem = total === 0 ? 0 : Math.round((feitos / total) * 100);

  return { feitos: feitos, total: total, porcentagem: porcentagem };
}

// ---------- Jardim e saudação ----------

const PLANTAS_NO_JARDIM = 4;

// RN13: quantas plantas do jardim estão floridas, pela porcentagem de hábitos
// concluídos hoje. 0% = 0 | 1% a 33% = 1 | 34% a 66% = 2 | 67% a 99% = 3 | 100% = 4
function estagioDoJardim(porcentagem) {
  if (porcentagem <= 0) {
    return 0;
  }

  if (porcentagem <= 33) {
    return 1;
  }

  if (porcentagem <= 66) {
    return 2;
  }

  if (porcentagem < 100) {
    return 3;
  }

  return 4;
}

// RN14: Bom dia (até 11h), Boa tarde (12h às 17h), Boa noite (a partir das 18h).
function saudacaoPorHora(hora) {
  if (hora < 12) {
    return 'Bom dia';
  }

  if (hora < 18) {
    return 'Boa tarde';
  }

  return 'Boa noite';
}