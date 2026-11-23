# Documento de Requisitos — Bloom (versão 2.1)

## 1. Visão do produto
O Bloom é uma aplicação web de hábitos, metas e diário que se adapta à energia da usuária no dia.
Em dias de pouca energia, o sistema mostra a **versão mínima** dos hábitos, e a **constância dos
últimos 30 dias** substitui a sequência (streak), para que dias ruins não gerem culpa nem abandono.

**Público-alvo:** mulheres jovens (estudantes e profissionais) com rotina cheia.
**Armazenamento:** localStorage do navegador, sem cadastro nem login (ver `decisao-projeto.md`).

## 2. Requisitos Funcionais
Status: **Implementado** (I) ou **Planejado** (P). Prioridade: Alta, Média ou Baixa.

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF01 | O sistema deve solicitar o nome da usuária no primeiro acesso e usá-lo na saudação. | Alta | I |
| RF02 | O sistema deve permitir criar um hábito com nome, categoria e versão mínima (opcional). | Alta | I |
| RF03 | O sistema deve permitir editar e excluir hábitos. | Alta | I |
| RF04 | O sistema deve permitir marcar e desmarcar um hábito como concluído no dia atual. | Alta | I |
| RF05 | O sistema deve exibir a lista de hábitos do dia, com a categoria de cada um. | Alta | I |
| RF06 | O sistema deve permitir registrar o nível de energia do dia (baixa, média ou alta). | Alta | I |
| RF07 | O sistema deve exibir a versão mínima dos hábitos quando a energia do dia for baixa. | Alta | I |
| RF08 | O sistema deve calcular e exibir a constância de cada hábito nos últimos 30 dias. | Média | I |
| RF09 | O sistema deve permitir criar uma meta com título, descrição (opcional) e data-alvo. | Alta | I |
| RF10 | O sistema deve permitir editar, excluir e concluir metas, e exibir o andamento (metas concluídas e prazo restante). | Alta | I |
| RF11 | O sistema deve permitir criar, editar e excluir registros de diário com data, humor do dia e texto, listando os mais recentes primeiro. | Média | I |
| RF12 | O sistema deve exibir um jardim de 4 plantas que florescem conforme a porcentagem de hábitos concluídos no dia. | Média | I |
| RF13 | O sistema deve exibir uma saudação conforme o horário (Bom dia, Boa tarde ou Boa noite). | Baixa | I |
| RF14 | O sistema deve oferecer navegação entre as páginas Meu dia, Hábitos, Metas e Diário. | Alta | I |
| RF15 | O sistema deve exibir uma frase motivacional diferente a cada dia. | Baixa | P |
| RF16 | O sistema deve exibir um resumo semanal de progresso (página de Progresso). | Baixa | P |
| RF17 | O sistema deve exibir uma retrospectiva semanal que relacione energia, humor e hábitos concluídos. | Baixa | P |

## 3. Requisitos Não Funcionais
- **RNF01:** O sistema deve ser responsivo (celular, tablet e computador).
- **RNF02:** As telas principais devem carregar em menos de 2 segundos.
- **RNF03:** Os dados devem ser armazenados localmente no navegador (localStorage) e permanecer entre acessos.
- **RNF04:** A interface deve seguir uma paleta de cores consistente e acolhedora (rosa, creme, verde-sálvia).
- **RNF05:** O acesso aos dados deve passar por um único módulo (`storage.js`), para facilitar uma futura troca por banco de dados.
- **RNF06:** O sistema deve estar publicado e acessível publicamente na internet (GitHub Pages).
- **RNF07:** O código deve seguir boas práticas de Clean Code: nomes significativos, arquivos organizados e separação entre armazenamento, regras de negócio e tela.
- **RNF08:** O sistema não deve usar linguagem de cobrança ou punição em suas mensagens.
- **RNF09:** Os campos de formulário devem ter rótulos associados e os botões devem poder ser usados pelo teclado.
- **RNF10:** O sistema deve funcionar nas versões atuais do Google Chrome.

## 4. Regras de Negócio
| ID | Regra |
|----|-------|
| RN01 | Todo hábito deve ter nome com pelo menos 2 caracteres (espaços nas pontas não contam) e uma categoria válida: Estudos, Autocuidado, Organização ou Bem-estar. |
| RN02 | Um hábito só pode estar concluído uma vez por dia; marcar de novo desfaz a conclusão. |
| RN03 | Se a energia do dia for baixa e o hábito tiver versão mínima, o sistema exibe a versão mínima; caso contrário, exibe a versão completa. |
| RN04 | Concluir a versão mínima conta como hábito concluído. O hábito concluído mantém a versão em que foi concluído, mesmo que a energia mude depois. |
| RN05 | Se a usuária não registrar a energia do dia, o sistema considera energia média. |
| RN06 | A constância de um hábito é o número de dias concluídos nos últimos 30 dias dividido por 30, em porcentagem arredondada. Dias sem conclusão reduzem a porcentagem, mas nunca zeram o histórico. |
| RN07 | O nome da usuária deve ter pelo menos 2 caracteres (espaços nas pontas não contam). |
| RN08 | Toda meta deve ter título com pelo menos 2 caracteres e data-alvo. A data-alvo não pode ser anterior à data de criação da meta (na criação e na edição). |
| RN09 | Uma meta concluída não conta como "em andamento". |
| RN10 | Toda entrada de diário deve ter data e texto não vazio; texto só com espaços é considerado vazio. |
| RN11 | Os dados ficam apenas no navegador da usuária, sem compartilhamento entre aparelhos. |
| RN12 | A exclusão de hábito, meta ou registro de diário exige confirmação da usuária. |
| RN13 | Plantas floridas no jardim pela porcentagem de hábitos concluídos no dia: 0% = 0; 1% a 33% = 1; 34% a 66% = 2; 67% a 99% = 3; 100% = 4. |
| RN14 | Saudação por horário: Bom dia até 11h; Boa tarde de 12h a 17h; Boa noite a partir das 18h. |
| RN15 | Meta não concluída com prazo vencido aparece como "prazo passou", sem linguagem de cobrança, e pode ter o prazo editado. |
| RN16 | O registro de diário exige humor do dia (Leve, Tranquilo, Cansativo ou Difícil) e data que não seja futura. |
| RN17 | Os registros de diário são listados da data mais recente para a mais antiga; na mesma data, o mais recente primeiro. |

## 5. Fora do escopo
Cadastro e login, banco de dados em nuvem, chat, rede social, inteligência artificial, pagamentos,
notificações, registro de ciclo menstrual e vínculo entre hábitos e metas.

## 6. Histórico de versões
- **v1.0:** versão inicial.
- **v2.0:** conceito de adaptação à energia da usuária; armazenamento local; regras de negócio.
- **v2.1:** requisitos alinhados ao que foi implementado (metas, diário, jardim, saudação, navegação), com status e novas regras de negócio (RN13 a RN17).