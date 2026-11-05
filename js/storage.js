// storage.js
// Único arquivo que acessa o localStorage. Todo o sistema usa só estas funções.
// Se um dia trocarmos por banco de dados, só este arquivo muda.

const armazenamento = {
  ler(chave, valorPadrao) {
    try {
      const texto = localStorage.getItem('bloom_' + chave);
      return texto ? JSON.parse(texto) : valorPadrao;
    } catch (erro) {
      return valorPadrao;
    }
  },

  salvar(chave, valor) {
    localStorage.setItem('bloom_' + chave, JSON.stringify(valor));
  }
};
