// storage.js
// Único arquivo que acessa o localStorage. Todo o sistema usa só estas funções.
// Se um dia trocarmos por banco de dados, só este arquivo muda.

const VERSAO_DO_ARMAZENAMENTO = 2;

const armazenamento = {
  ler(chave, valorPadrao) {
    try {
      const texto = localStorage.getItem('bloom_' + chave);
      return texto ? JSON.parse(texto) : valorPadrao;
    } catch (erro) {
      return valorPadrao;
    }
  },

  // Devolve true se salvou e false se o navegador recusou (sem espaço, aba privada).
  salvar(chave, valor) {
    try {
      localStorage.setItem('bloom_' + chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      console.error('Não foi possível salvar os dados:', erro);
      return false;
    }
  }
};

// Versão 1 -> 2: as conclusões do dia eram só números (ids); agora são { id, versao }.
// Roda uma vez e não perde nada do que já estava salvo.
function migrarArmazenamento() {
  if (armazenamento.ler('versao', 1) >= VERSAO_DO_ARMAZENAMENTO) {
    return;
  }

  const registros = armazenamento.ler('registros', {});

  Object.keys(registros).forEach(function (data) {
    if (!Array.isArray(registros[data])) {
      registros[data] = [];
      return;
    }

    registros[data] = registros[data].map(function (item) {
      return typeof item === 'object' && item !== null
        ? item
        : { id: item, versao: 'completa' };
    });
  });

  armazenamento.salvar('registros', registros);
  armazenamento.salvar('versao', VERSAO_DO_ARMAZENAMENTO);
}

migrarArmazenamento();