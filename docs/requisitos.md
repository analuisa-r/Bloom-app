# Documento de Requisitos — Bloom (versão 2.0)

## Visão do produto
O Bloom é um app de hábitos que se adapta à energia da usuária no dia.
Em dias difíceis, ele sugere versões mínimas dos hábitos e mede constância
em vez de sequências, para que dias ruins não gerem culpa nem abandono.

## Requisitos Funcionais
| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | O sistema deve solicitar o nome da usuária no primeiro acesso e usá-lo na saudação. | Alta |
| RF02 | O sistema deve permitir criar um hábito com nome, categoria e, opcionalmente, uma versão mínima. | Alta |
| RF03 | O sistema deve permitir editar e excluir hábitos. | Alta |
| RF04 | O sistema deve permitir marcar um hábito como concluído no dia atual. | Alta |
| RF05 | O sistema deve exibir a checklist dos hábitos do dia. | Alta |
| RF06 | O sistema deve permitir registrar o nível de energia do dia (baixa, média ou alta). | Alta |
| RF07 | O sistema deve exibir a versão mínima dos hábitos quando a energia do dia for baixa. | Alta |
| RF08 | O sistema deve calcular e exibir a constância de cada hábito nos últimos 30 dias. | Média |
| RF09 | O sistema deve permitir criar uma meta com título, descrição e data-alvo. | Alta |
| RF10 | O sistema deve permitir editar, excluir e concluir metas. | Alta |
| RF11 | O sistema deve permitir criar, editar e excluir entradas de diário, com humor do dia. | Média |
| RF12 | O sistema deve exibir um jardim com uma planta por categoria, cujo estágio depende da constância na categoria. | Baixa |
| RF13 | O sistema deve exibir uma retrospectiva semanal relacionando energia, humor e hábitos concluídos. | Baixa |
| RF14 | O sistema deve exibir uma frase motivacional diferente a cada dia. | Baixa |

## Requisitos Não Funcionais
- RNF01: O sistema deve ser responsivo (celular, tablet e computador).
- RNF02: As telas principais devem carregar em menos de 2 segundos.
- RNF03: Os dados devem ser armazenados localmente no navegador (localStorage), de forma persistente.
- RNF04: A interface deve seguir uma paleta de cores consistente e acolhedora.
- RNF05: O acesso aos dados deve passar por um único módulo (storage.js).
- RNF06: O sistema deve estar publicado e acessível publicamente na internet.
- RNF07: O código deve seguir boas práticas de Clean Code.
- RNF08: O sistema não deve usar linguagem de cobrança ou punição em suas mensagens.

## Regras de Negócio
- RN01: Todo hábito deve ter nome e categoria (estudos, autocuidado, organização ou bem-estar).
- RN02: Um hábito só pode ser concluído uma vez por dia.
- RN03: Se a energia do dia for baixa e o hábito tiver versão mínima, o sistema exibe a versão mínima; caso contrário, exibe a versão completa.
- RN04: Concluir a versão mínima conta como hábito concluído no dia.
- RN05: Se a usuária não registrar a energia, o sistema considera energia média.
- RN06: A constância de um hábito é o número de dias concluídos nos últimos 30 dias dividido por 30, em porcentagem. Dias sem conclusão não zeram nada.
- RN07: Estágio da planta por constância na categoria: 0% a 24% = broto; 25% a 49% = muda; 50% a 74% = planta; 75% a 100% = florida. Uma planta nunca "morre": sem cuidado, ela apenas descansa.
- RN08: Toda meta deve ter título e data-alvo; a data-alvo não pode ser anterior à data de criação.
- RN09: Uma meta concluída não conta como "em andamento".
- RN10: Cada entrada de diário deve ter data e texto não vazio.
- RN11: Os dados ficam apenas no navegador da usuária, sem compartilhamento entre aparelhos.
- RN12: A exclusão de hábito, meta ou entrada de diário exige confirmação.

## Histórico de versões
- v1.0: versão inicial.
- v2.0: conceito de adaptação à energia da usuária; armazenamento local (sem cadastro); regras de negócio e prioridades.
