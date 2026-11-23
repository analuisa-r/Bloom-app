# Plano de Testes — Bloom

## 1. Objetivo
Verificar se as funcionalidades implementadas do Bloom cumprem os requisitos de `requisitos.md` (v2.1)
e identificar defeitos antes da entrega.

## 2. Escopo
**Testado:** RF01 a RF14, RNF01, RNF03, RNF09 e RN01 a RN17.
**Fora do escopo desta rodada:** RF15 a RF17 (planejados), desempenho (RNF02) e navegadores diferentes do Chrome.

## 3. Estratégia e técnicas
- **Partição em classes de equivalência:** entradas válidas e inválidas de nome, categoria, humor e energia.
- **Análise de valor limite:** tamanho mínimo de nomes (1 e 2 caracteres), data-alvo da meta (ontem, hoje, amanhã), estágios do jardim (0, 1, 33, 34, 66, 67, 99 e 100%) e horários da saudação (11h, 12h, 17h e 18h).
- **Tabela de decisão:** exibição da versão mínima (energia × existência da versão mínima).
- **Teste exploratório e de usabilidade:** roteiro com pessoas reais (seção 8).
- **Testes por console:** algumas regras de data e horário são verificadas chamando a função no console do navegador (F12 > Console), pois não dependem da tela.

## 4. Ambiente
Google Chrome atualizado, no computador (Windows) e no modo de celular das Ferramentas do Desenvolvedor.
Aplicação publicada: https://analuisa-r.github.io/Bloom-app/ e também no Live Server local.

## 5. Preparação
Antes de cada rodada: abrir o site, apertar F12 > Aplicativo > Armazenamento local, limpar os dados e recarregar com Ctrl + F5.

## 6. Critérios
- **Entrada:** versão publicada, requisitos v2.1 e dados limpos.
- **Saída:** todos os casos executados; defeitos de prioridade alta corrigidos e retestados.

## 7. Casos de teste
Legenda de status: **P** = passou, **F** = falhou. Preencher "Obtido", "Status" e a data de execução.

### 7.1 Nome e saudação (Meu dia)
| ID | Req. | Técnica | Passos | Resultado esperado | Obtido | Status |
|----|------|---------|--------|--------------------|--------|--------|
| CT01 | RF01, RN07 | Classe válida | Dados limpos. Em Meu dia, digitar "Ana" e clicar em Começar | Painel aparece; título mostra a saudação e "Ana" | | |
| CT02 | RN07 | Valor limite | Digitar "A" (1 letra) e clicar em Começar | Mensagem "Digite um nome com pelo menos 2 letras."; nome não é salvo | | |
| CT03 | RN07 | Valor limite | Digitar "Li" (2 letras) | Nome aceito | | |
| CT04 | RN07 | Classe inválida | Deixar vazio, ou digitar só espaços | Mensagem de erro; nome não é salvo | | |
| CT05 | RF13, RN14 | Valor limite | No console: `saudacaoPorHora(11)`, `(12)`, `(17)`, `(18)` | "Bom dia", "Boa tarde", "Boa tarde", "Boa noite" | | |

### 7.2 Energia
| ID | Req. | Técnica | Passos | Resultado esperado | Obtido | Status |
|----|------|---------|--------|--------------------|--------|--------|
| CT06 | RF06 | Classe válida | Em Meu dia, clicar em Baixa | Cartão marcado; texto sobre versão leve; aparece "Ver meus hábitos de hoje" | | |
| CT07 | RF06 | Classe válida | Clicar em Média e depois em Alta | Só o último fica marcado; o texto muda a cada escolha | | |
| CT08 | RF06, RNF03 | Persistência | Escolher uma energia, fechar a aba e reabrir | A energia continua marcada | | |
| CT09 | RN05 | Classe inválida | Dados limpos, sem escolher energia: abrir Meu dia e Hábitos | "Ver meus hábitos" oculto; em Hábitos aparece "ainda não registrada"; a lista usa a versão completa | | |

### 7.3 Hábitos
| ID | Req. | Técnica | Passos | Resultado esperado | Obtido | Status |
|----|------|---------|--------|--------------------|--------|--------|
| CT10 | RF02, RN01 | Classe válida | Criar hábito "Ler" com categoria Estudos | Aparece na lista com a categoria | | |
| CT11 | RN01 | Valor limite | Criar hábito com nome de 1 letra | Mensagem de erro; hábito não é criado | | |
| CT12 | RN01 | Valor limite | Criar hábito com nome de 2 letras | Hábito criado | | |
| CT13 | RN01 | Classe inválida | Criar hábito com nome vazio ou só espaços | Mensagem de erro | | |
| CT14 | RN01 | Classe válida | Abrir o campo Categoria | Mostra Estudos, Autocuidado, Organização e Bem-estar | | |
| CT15 | RF02 | Classe válida | Criar hábito sem versão mínima | Hábito criado normalmente | | |
| CT16 | RF04, RN02 | Classe válida | Marcar a caixinha de um hábito | Hábito fica concluído | | |
| CT17 | RN02 | Classe válida | Desmarcar o hábito concluído | Volta a pendente | | |
| CT18 | RF03 | Classe válida | Clicar em Editar e informar novo nome, categoria válida e versão mínima | Dados atualizados na lista | | |
| CT19 | RN01 | Valor limite | Clicar em Editar e informar nome de 1 letra | Nenhuma alteração é aplicada | | |
| CT20 | RN01 | Classe inválida | Editar com categoria escrita errada (ex.: "Estudo") | Mensagem "Verifique o nome e a categoria."; nada muda | | |
| CT21 | RF03, RN12 | Classe válida | Excluir e confirmar | Hábito removido | | |
| CT22 | RN12 | Classe válida | Excluir e cancelar | Hábito continua na lista | | |
| CT23 | RF03 | Efeito colateral | Concluir um hábito, excluí-lo e criar outro | O novo hábito não aparece concluído | | |
| CT24 | RF08, RN06 | Classe válida | Criar hábito e concluir hoje | "Constância: 3%" (1 dia em 30) | | |
| CT25 | RF08 | Classe válida | Desmarcar o hábito | "Constância: 0%" | | |
| CT26 | RNF03 | Persistência | Criar hábitos, concluir um, recarregar a página | Hábitos e conclusões continuam | | |

### 7.4 Versão mínima (tabela de decisão)
| ID | Req. | Energia | Tem versão mínima | Resultado esperado | Obtido | Status |
|----|------|---------|-------------------|--------------------|--------|--------|
| CT27 | RF07, RN03 | Baixa | Sim | Texto principal é a versão mínima; abaixo, "Versão completa: ..." | | |
| CT28 | RN03 | Baixa | Não | Mostra o nome do hábito | | |
| CT29 | RN03 | Média | Sim | Mostra o nome; abaixo, "Versão mínima: ..." | | |
| CT30 | RN03 | Alta | Sim | Mostra o nome; abaixo, "Versão mínima: ..." | | |
| CT31 | RN05 | Sem registro | Sim | Comporta-se como Média | | |
| CT32 | RN04 | Baixa | Sim | Concluir na energia baixa e mudar para Alta: o hábito continua com a versão mínima e "Concluído na versão mínima" | | |

### 7.5 Jardim (Meu dia)
| ID | Req. | Técnica | Passos | Resultado esperado | Obtido | Status |
|----|------|---------|--------|--------------------|--------|--------|
| CT33 | RF12, RN13 | Valor limite | No console: `estagioDoJardim(p)` para p = 0, 1, 33, 34, 66, 67, 99, 100 | 0, 1, 1, 2, 2, 3, 3, 4 | | |
| CT34 | RF12 | Classe válida | Com 3 hábitos, concluir 1 | 33%; 1 planta florida | | |
| CT35 | RF12 | Classe válida | Concluir o 2º hábito | 67%; 3 plantas floridas | | |
| CT36 | RF12 | Valor limite | Concluir o 3º hábito | 100%; 4 plantas floridas | | |
| CT37 | RF12 | Classe inválida | Sem nenhum hábito cadastrado | 0%; texto "Você ainda não tem hábitos..." | | |

### 7.6 Metas
| ID | Req. | Técnica | Passos | Resultado esperado | Obtido | Status |
|----|------|---------|--------|--------------------|--------|--------|
| CT38 | RF09, RN08 | Classe válida | Criar meta com título, descrição e data futura | Meta aparece com "faltam N dias" e etiqueta "Em andamento" | | |
| CT39 | RN08 | Valor limite | Título com 1 letra | Mensagem de erro | | |
| CT40 | RN08 | Valor limite | Título com 2 letras | Meta criada | | |
| CT41 | RN08 | Classe inválida | Deixar a data-alvo vazia | Mensagem "Escolha a data-alvo da meta." | | |
| CT42 | RN08 | Valor limite | Data-alvo de ontem (digitar no campo) | Mensagem de erro; meta não é criada | | |
| CT43 | RN08 | Valor limite | Data-alvo de hoje | Meta criada; "Prazo: hoje" | | |
| CT44 | RF10, RN09 | Classe válida | Marcar a meta como concluída | Etiqueta "Concluída"; resumo "Metas cuidadas" atualiza | | |
| CT45 | RF10 | Classe válida | Desmarcar a meta | Volta a "Em andamento" | | |
| CT46 | RF10 | Classe válida | Editar título, descrição e data | Dados atualizados | | |
| CT47 | RN08 | Classe inválida | Editar uma meta e colocar data anterior à criação | Mensagem de erro; meta não muda | | |
| CT48 | RF10 | Classe válida | Editar e clicar em Cancelar edição | Formulário volta ao modo "nova meta" | | |
| CT49 | RN12 | Classe válida | Excluir e confirmar; depois excluir e cancelar | Confirmar remove; cancelar mantém | | |
| CT50 | RN15, RN09 | Classe válida | No console: `situacaoDaMeta({concluida:false, dataAlvo:'2020-01-01'})` e com `concluida:true` | "prazo passou" e "concluída" | | |
| CT51 | RNF03 | Persistência | Criar metas, recarregar | Metas continuam | | |

### 7.7 Diário
| ID | Req. | Técnica | Passos | Resultado esperado | Obtido | Status |
|----|------|---------|--------|--------------------|--------|--------|
| CT52 | RF11, RN10 | Classe válida | Data de hoje, humor Leve, texto "Dia bom" | Registro aparece com data por extenso e humor | | |
| CT53 | RN16 | Classe inválida | Salvar sem escolher humor | Mensagem "Escolha como foi o seu dia." | | |
| CT54 | RN10 | Classe inválida | Texto vazio | Mensagem "Escreva um pouco sobre o seu dia." | | |
| CT55 | RN10 | Classe inválida | Texto só com espaços | Mesma mensagem de erro | | |
| CT56 | RN10 | Classe inválida | Apagar a data e salvar | Mensagem "Escolha a data do registro." | | |
| CT57 | RN16 | Valor limite | No console: `validarEntradaDeDiario` com a data de amanhã (AAAA-MM-DD), humor "Leve" e texto "oi" | "A data do registro não pode ser futura." | | |
| CT58 | RN16 | Valor limite | Data de hoje, com humor e texto | Registro salvo | | |
| CT59 | RN17 | Classe válida | Salvar um registro de ontem e outro de hoje | O de hoje aparece primeiro | | |
| CT60 | RF11 | Classe válida | Editar um registro e salvar | Dados atualizados | | |
| CT61 | RF11, RN10 | Classe inválida | Editar apagando o texto | Mensagem de erro; registro não muda | | |
| CT62 | RF11 | Classe válida | Editar e clicar em Cancelar edição | Formulário volta ao modo "novo registro" | | |
| CT63 | RN12 | Classe válida | Excluir e confirmar; depois excluir e cancelar | Confirmar remove; cancelar mantém | | |
| CT64 | RNF03 | Persistência | Criar registros, recarregar | Registros continuam | | |

### 7.8 Navegação e interface
| ID | Req. | Técnica | Passos | Resultado esperado | Obtido | Status |
|----|------|---------|--------|--------------------|--------|--------|
| CT65 | RF14 | Fluxo | Landing: clicar em "Começar agora" | Abre Meu dia | | |
| CT66 | RF14 | Fluxo | Em cada página, clicar nos 4 links do menu | Cada link abre a página certa; a página atual aparece destacada | | |
| CT67 | RF14 | Fluxo | Em Meu dia, escolher energia e clicar em "Ver meus hábitos de hoje"; em Hábitos, clicar em "mudar" | Leva a Hábitos e volta a Meu dia | | |
| CT68 | RNF01 | Classe | Ferramentas do Desenvolvedor (F12) > modo celular, larguras de 360, 768 e 1280 px | Sem rolagem lateral; colunas empilham no celular | | |
| CT69 | RNF09 | Exploratório | Navegar pelos formulários só com Tab, Enter e espaço | Todos os campos e botões são alcançados e usados | | |
| CT70 | RNF08 | Inspeção | Ler todas as mensagens e etiquetas | Nenhuma usa linguagem de cobrança ou punição | | |

## 8. Teste de usabilidade
Pedir a 3 pessoas que, sem ajuda, executem: (1) informar o nome, (2) registrar a energia, (3) criar um hábito com versão mínima, (4) concluí-lo, (5) criar uma meta, (6) escrever no diário.

| Pessoa | Conseguiu todas as tarefas? | Onde hesitou ou errou? | Sugestão |
|--------|-----------------------------|------------------------|----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 9. Registro de defeitos
| ID | Caso | Descrição | Gravidade | Corrigido em (commit) | Reteste |
|----|------|-----------|-----------|-----------------------|---------|
| D01 | | | | | |

## 10. Rastreabilidade (requisito × casos)
| Requisito | Casos |
|-----------|-------|
| RF01, RN07 | CT01 a CT04 |
| RF02, RN01 | CT10 a CT15 |
| RF03, RN12 | CT18 a CT23 |
| RF04, RN02 | CT16, CT17 |
| RF05 | CT10, CT26 |
| RF06, RN05 | CT06 a CT09 |
| RF07, RN03, RN04 | CT27 a CT32 |
| RF08, RN06 | CT24, CT25 |
| RF09, RN08 | CT38 a CT43 |
| RF10, RN09, RN15 | CT44 a CT51 |
| RF11, RN10, RN16, RN17 | CT52 a CT64 |
| RF12, RN13 | CT33 a CT37 |
| RF13, RN14 | CT05 |
| RF14 | CT65 a CT67 |
| RNF01, RNF08, RNF09 | CT68 a CT70 |
| RNF03, RN11 | CT08, CT26, CT51, CT64 |

## 11. Execução
Registrar a data de cada rodada e quem executou.
- Rodada 1: ____ / ____ / 2026 — Ana Luísa