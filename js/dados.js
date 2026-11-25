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

const MAXIMO_DE_PLANTAS = 12;

// RN13: o jardim tem uma planta por hábito: broto se o hábito ainda não foi
// concluído hoje, florida se foi. Mostra até 12 plantas; as demais viram "+N".
function montarJardim() {
  const concluidos = listarConcluidosDeHoje();

  const plantas = listarHabitos().map(function (habito) {
    return {
      nome: habito.nome,
      florida: concluidos.some(function (registro) {
        return registro.id === habito.id;
      })
    };
  });

  return {
    plantas: plantas.slice(0, MAXIMO_DE_PLANTAS),
    excedentes: Math.max(0, plantas.length - MAXIMO_DE_PLANTAS)
  };
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

// ---------- Metas ----------

function listarMetas() {
  return armazenamento.ler('metas', []);
}

// RN08: toda meta tem título (mínimo 2 letras) e data-alvo, e a data-alvo
// não pode ser anterior à data de criação da meta.
// Devolve '' se está tudo certo, ou a mensagem do problema.
function validarMeta(titulo, dataAlvo, dataMinima) {
  if (titulo.trim().length < 2) {
    return 'Digite um título com pelo menos 2 letras.';
  }

  if (dataAlvo === '') {
    return 'Escolha a data-alvo da meta.';
  }

  if (dataAlvo < dataMinima) {
    return 'A data-alvo não pode ser anterior à data de criação da meta.';
  }

  return '';
}

// Devolve '' se criou, ou a mensagem do problema.
function criarMeta(titulo, descricao, dataAlvo) {
  const erro = validarMeta(titulo, dataAlvo, dataDeHoje());

  if (erro !== '') {
    return erro;
  }

  const metas = listarMetas();

  metas.push({
    id: Date.now() + Math.random(),
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    dataAlvo: dataAlvo,
    criadaEm: dataDeHoje(),
    concluida: false
  });

  armazenamento.salvar('metas', metas);

  return '';
}

// Devolve '' se editou, ou a mensagem do problema.
function editarMeta(id, titulo, descricao, dataAlvo) {
  const metas = listarMetas();
  const indice = metas.findIndex(function (meta) {
    return meta.id === id;
  });

  if (indice === -1) {
    return 'Meta não encontrada.';
  }

  const erro = validarMeta(titulo, dataAlvo, metas[indice].criadaEm);

  if (erro !== '') {
    return erro;
  }

  metas[indice] = {
    ...metas[indice],
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    dataAlvo: dataAlvo
  };

  armazenamento.salvar('metas', metas);

  return '';
}

function excluirMeta(id) {
  armazenamento.salvar('metas', listarMetas().filter(function (meta) {
    return meta.id !== id;
  }));
}

function alternarMetaConcluida(id) {
  const metas = listarMetas().map(function (meta) {
    return meta.id === id ? { ...meta, concluida: !meta.concluida } : meta;
  });

  armazenamento.salvar('metas', metas);
}

// Dias entre hoje e a data-alvo (negativo se o prazo já passou).
function diasAteOPrazo(dataAlvo) {
  const hoje = new Date(dataDeHoje() + 'T00:00:00');
  const alvo = new Date(dataAlvo + 'T00:00:00');

  return Math.round((alvo - hoje) / 86400000);
}

// RN09: meta concluída não conta como "em andamento".
// RN15: meta não concluída com prazo vencido fica como "prazo passou"
// (sem linguagem de cobrança, e a usuária pode editar o prazo).
function situacaoDaMeta(meta) {
  if (meta.concluida) {
    return 'concluída';
  }

  return diasAteOPrazo(meta.dataAlvo) < 0 ? 'prazo passou' : 'em andamento';
}

function calcularResumoDeMetas() {
  const metas = listarMetas();
  const concluidas = metas.filter(function (meta) {
    return meta.concluida;
  }).length;

  const porcentagem = metas.length === 0
    ? 0
    : Math.round((concluidas / metas.length) * 100);

  return { concluidas: concluidas, total: metas.length, porcentagem: porcentagem };
}

// ---------- Diário ----------

const HUMORES = ['Leve', 'Tranquilo', 'Cansativo', 'Difícil'];

function listarDiario() {
  return armazenamento.ler('diario', []);
}

// Mais recentes primeiro (por data e, no mesmo dia, pela hora do registro).
function listarDiarioOrdenado() {
  return listarDiario().slice().sort(function (a, b) {
    if (a.data !== b.data) {
      return a.data < b.data ? 1 : -1;
    }

    return b.criadoEm - a.criadoEm;
  });
}

// RN10: toda entrada tem data e texto não vazio.
// RN16: a data não pode ser futura, e o humor do dia é obrigatório.
// Devolve '' se está tudo certo, ou a mensagem do problema.
function validarEntradaDeDiario(data, humor, texto) {
  if (data === '') {
    return 'Escolha a data do registro.';
  }

  if (data > dataDeHoje()) {
    return 'A data do registro não pode ser futura.';
  }

  if (!HUMORES.includes(humor)) {
    return 'Escolha como foi o seu dia.';
  }

  if (texto.trim() === '') {
    return 'Escreva um pouco sobre o seu dia.';
  }

  return '';
}

// Devolve '' se salvou, ou a mensagem do problema.
function criarEntradaDeDiario(data, humor, texto) {
  const erro = validarEntradaDeDiario(data, humor, texto);

  if (erro !== '') {
    return erro;
  }

  const entradas = listarDiario();

  entradas.push({
    id: Date.now() + Math.random(),
    data: data,
    humor: humor,
    texto: texto.trim(),
    criadoEm: Date.now()
  });

  armazenamento.salvar('diario', entradas);

  return '';
}

// Devolve '' se editou, ou a mensagem do problema.
function editarEntradaDeDiario(id, data, humor, texto) {
  const erro = validarEntradaDeDiario(data, humor, texto);

  if (erro !== '') {
    return erro;
  }

  const entradas = listarDiario();
  const indice = entradas.findIndex(function (entrada) {
    return entrada.id === id;
  });

  if (indice === -1) {
    return 'Registro não encontrado.';
  }

  entradas[indice] = {
    ...entradas[indice],
    data: data,
    humor: humor,
    texto: texto.trim()
  };

  armazenamento.salvar('diario', entradas);

  return '';
}

function excluirEntradaDeDiario(id) {
  armazenamento.salvar('diario', listarDiario().filter(function (entrada) {
    return entrada.id !== id;
  }));
}