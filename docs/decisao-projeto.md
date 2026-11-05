# Registro de Decisão do Projeto

## Ideias consideradas
Durante a fase de concepção, foram consideradas diversas ideias de sistemas,
incluindo ferramentas voltadas a acessibilidade digital e tecnologias assistivas,
além de opções focadas em bem-estar pessoal.

Havia o desejo de desenvolver uma solução voltada ao público feminino, em especial
meninas e jovens mulheres que buscam organizar a rotina, criar hábitos positivos e
cuidar de si. Essa ideia deu origem ao Bloom.

## Ideia escolhida: Bloom
Optou-se pelo desenvolvimento do Bloom, um aplicativo de hábitos, metas e
autocuidado, por ser tecnicamente viável para desenvolvimento individual ao longo
de um semestre, permitir a documentação de um conjunto rico de requisitos e casos
de teste, e ter utilidade prática e pessoal real.

## Justificativa da escolha
- Escopo controlável para desenvolvimento individual;
- Não depende de validação externa complexa para funcionar bem;
- Permite iteração incremental (MVP simples, com funcionalidades adicionadas em fases);
- Relevância pessoal e social como ferramenta de organização e bem-estar.

## Decisão técnica: armazenamento de dados
Optou-se por utilizar o localStorage do navegador, sem cadastro e login, por ser
adequado ao nível técnico do projeto e ao prazo disponível. Todo acesso aos dados
fica concentrado em um único arquivo (storage.js), o que permite evoluir para um
banco de dados (ex.: Supabase) no futuro.

Consequências assumidas: os dados ficam restritos ao aparelho e navegador usados,
e podem ser perdidos se o navegador for limpo.
