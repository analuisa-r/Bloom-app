# Documento de Requisitos — Bloom (versão 1.1)

## Requisitos Funcionais
| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | O sistema deve solicitar o nome da usuária no primeiro acesso e guardá-lo para personalizar a saudação. | Alta |
| RF02 | O sistema deve permitir criar um hábito com nome, categoria, frequência e ícone/cor. | Alta |
| RF03 | O sistema deve permitir editar e excluir hábitos. | Alta |
| RF04 | O sistema deve permitir marcar um hábito como concluído no dia atual. | Alta |
| RF05 | O sistema deve exibir uma checklist com os hábitos do dia atual. | Alta |
| RF06 | O sistema deve calcular e exibir a sequência (streak) de dias consecutivos de um hábito. | Média |
| RF07 | O sistema deve permitir criar uma meta com título, descrição e data-alvo. | Alta |
| RF08 | O sistema deve permitir editar e excluir metas. | Alta |
| RF09 | O sistema deve permitir marcar uma meta como concluída. | Alta |
| RF10 | O sistema deve permitir criar, editar e excluir entradas de diário. | Alta |
| RF11 | O sistema deve exibir uma frase motivacional diferente a cada dia. | Média |
| RF12 | O sistema deve exibir um resumo visual semanal do progresso de hábitos e metas. | Média |
| RF13 | O sistema deve permitir vincular um hábito a uma meta. | Baixa |

## Requisitos Não Funcionais
- RNF01: O sistema deve ser responsivo (celular, tablet e computador).
- RNF02: As telas principais devem carregar em menos de 2 segundos.
- RNF03: Os dados devem ser armazenados localmente no navegador (localStorage), de forma persistente entre acessos.
- RNF04: A interface deve seguir uma paleta de cores consistente e acolhedora.
- RNF05: O acesso aos dados deve ser feito por um único módulo (storage.js), para facilitar uma futura troca por banco de dados.
- RNF06: O sistema deve estar publicado e acessível publicamente na internet.
- RNF07: O código deve seguir boas práticas de Clean Code (nomes significativos, arquivos organizados).

## Regras de Negócio
- RN01: Todo hábito deve ter nome e categoria (estudos, autocuidado, organização ou bem-estar).
- RN02: Um hábito só pode ser marcado como concluído uma vez por dia.
- RN03: A sequência (streak) é zerada quando um dia previsto passa sem conclusão.
- RN04: Toda meta deve ter título e data-alvo; a data-alvo não pode ser anterior à data atual no momento da criação.
- RN05: Uma meta concluída não conta como "em andamento".
- RN06: Cada entrada de diário deve ter data e texto não vazio.
- RN07: Os dados de cada usuária ficam armazenados apenas no navegador do aparelho dela, sem compartilhamento entre aparelhos.
- RN08: A exclusão de hábito, meta ou entrada de diário exige confirmação da usuária.

## Histórico de versões
- v1.0: versão inicial.
- v1.1: ajustado para armazenamento local (sem cadastro), incluídas regras de negócio e prioridades.
