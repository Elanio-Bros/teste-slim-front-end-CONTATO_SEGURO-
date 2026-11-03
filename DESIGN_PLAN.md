# Plano de Design: Contato Seguro Slim (Frontend)

## 1. Visão Geral e Entendimento do Problema

O objetivo do sistema é apoiar os **Membros de Comitê** na auditoria e apuração de **Relatos** (denúncias e ocorrências corporativas). 

Atualmente, o sistema apenas registra a empresa e o relato, sem histórico de quem são as partes envolvidas. A nova demanda visa solucionar essa deficiência introduzindo dois conceitos complementares:
1. **Pessoa:** Cadastro centralizado de indivíduos para identificar quem participa das ocorrências.
2. **Envolvimento:** A definição de como cada pessoa se relaciona com um relato específico, estabelecendo seu papel na apuração (Relatante, Testemunha, Vítima ou Denunciado).

Com isso, a operação ganha rastreabilidade, reduz a perda de contexto investigativo e permite mapear reincidências de forma estruturada.

## 2. Objetivos e Escopo da Entrega

O objetivo central é dar mais contexto e rastreabilidade aos relatos existentes através da identificação estruturada dos envolvidos.
O escopo é delimitado para a aplicação web, sem incluir controle de acesso, fluxo completo de investigação ou notificações externas.
Dessa forma, mantemos o foco nas necessidades centrais solicitadas, deixando expansões como aplicativos móveis para momentos futuros.

## 3. Épicos do Produto

### 3.1 Gestão de Pessoas
O conceito de pessoa é concebido de forma global, não atrelado a uma empresa específica, permitindo que o mesmo indivíduo seja reutilizado em múltiplos relatos e investigações.
Para o cadastro, são obrigatórios os dados de nome completo, CPF, e-mail e data de nascimento.
A unicidade do CPF é assegurada pelo backend, cabendo ao frontend validar o formato dos dados de entrada e tratar as respostas de conflito de forma transparente para o usuário.

### 3.2 Envolvimento
O envolvimento estabelece o vínculo entre uma pessoa cadastrada e um relato específico, categorizando-a em um de quatro papéis: Relatante, Testemunha, Vítima ou Denunciado.
Cada pessoa pode ser associada apenas uma vez ao mesmo relato com um único papel (não sendo permitido, por exemplo, que a mesma pessoa seja vítima e testemunha no mesmo relato), embora possa participar de diferentes relatos com papéis variados.
O status de anonimato do relato é derivado dinamicamente dessa relação: o caso é classificado como Anônimo quando não há nenhuma pessoa vinculada no papel de Relatante, tornando-se Identificado no momento em que um relatante for associado.

## 4. Planejamento da Interface e Navegação

### 4.1 Módulo de Pessoas (`/people`)
- Nova rota e menu lateral dedicado à gestão de pessoas, seguindo o padrão visual do sistema.
- Tabela com listagem dos dados (Nome, CPF formatado, E-mail, Data de Nascimento).
- Botão para abertura de modal de cadastro de nova pessoa.
- Ações na tabela para edição (atualização dos dados) e exclusão com diálogo de confirmação.

### 4.2 Módulo de Relatos e Gestão de Envolvidos
- **Tabela de Relatos:** Inclusão da coluna "Identificação", exibindo visualmente através de tags se o relato é "Anônimo" ou "Identificado".
- **Formulários de Relato:** Inclusão de uma seção com tabela abaixo dos campos principais para visualização, adição e remoção de pessoas e com seus respectivos papéis (Relatante, Testemunha, Vítima ou Denunciado).

## 5. Decisões Técnicas e Riscos Mapeados

- **Tratamento de CPF Duplicado (HTTP 409):** A unicidade é garantida pelo backend retornando status 409. O frontend intercepta essa resposta e exibe uma notificação amigável e clara no formulário, prevenindo confusão do usuário.
- **Prevenção de Duplicidade em Relatos (HTTP 409):** Como a API impede que a mesma pessoa seja adicionada mais de uma vez no mesmo relato, o frontend filtra na seleção apenas pessoas ainda não vinculadas àquele caso, evitando o erro antes mesmo da requisição.
- **Formatação e Validação de CPF:** Para melhor usabilidade, o input de CPF utiliza máscara visual (`000.000.000-00`), enquanto o envio para a API é sanitizado contendo estritamente os 11 dígitos numéricos exigidos pela regra de negócio.
- **Conformidade Arquitetural e Restrições:** Toda a implementação ocorre exclusivamente no diretório `client/`, adotando o padrão modular por domínios (`domain/person/` e `domain/record/`) com React 19 e Ant Design 5, preservando a integridade do backend existente (`server/`).
