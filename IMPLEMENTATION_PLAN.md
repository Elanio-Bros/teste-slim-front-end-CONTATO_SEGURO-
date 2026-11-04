# Plano de Implementação: Contato Seguro Slim (Frontend)

Este documento detalha o roteiro prático e detalhado de execução, organizado em 3 fases principais com suas respectivas subatividades.

---

## Fase 1: Setup e Planejamento Inicial
- [X] **1.1 Ambiente de Desenvolvimento Local**
  - [X] Subir containers Docker (`api`, `database`, `nginx`, `frontend`).
  - [X] Executar migrações do banco com Phinx (`composer run phinx:migrate`).
  - [X] Popular o banco com dados de teste (`composer run phinx:seed`).
  - [X] Validar o funcionamento da API e do Front-end.
- [X] **1.2 Documentação do Plano de Design**
  - [X] Análise do PRD e mapeamento das regras de negócio.
  - [X] Redação e commit do `DESIGN_PLAN.md` no repositório.

---

## Fase 2: Implementação dos Épicos no Front-end

### 2.1 Épico 1: Gestão de Pessoas (`/people`)
- [X] **Tipagem e Consumo da API no Front-end:**
  - [X] Modelar tipos TypeScript (`person.type.ts`).
  - [X] Implementar serviços de consumo da API (`list-people.service.ts`, `find-person.service.ts`, `create-person.service.ts`, `update-person.service.ts`, `delete-person.service.ts`).
  - [X] Criar contexto de estado (`People.context.tsx`).
- [X] **Componentes de Interface (UI):**
  - [X] Tabela de listagem de pessoas (`People.page.tsx`) com dados e ações.
  - [X] Formulário com validações e máscara de CPF (`PersonFields.tsx`).
  - [X] Modal de cadastro de nova pessoa (`CreatePersonModal.tsx`).
  - [X] Modal de edição de pessoa (`EditPersonModal.tsx`).
  - [X] Ação de exclusão com confirmação (`PeopleActionsCell.tsx`).
  - [X] Tratamento amigável para erro de CPF duplicado (HTTP 409).
- [X] **Navegação:**
  - [X] Adicionar rota `/people` no `router.tsx` e item no menu lateral (`MainLayout.tsx`).

### 2.2 Épico 2: Gestão de Envolvimentos nos Relatos (`/records`)
- [X] **Tipagem e Consumo da API no Front-end:**
  - [X] Modelar tipos de envolvimento e papéis (`involvement.type.ts`).
  - [X] Implementar serviços de consumo da API de envolvimentos (`list-record-involvements.service.ts`, `create-record-involvement.service.ts`, `delete-record-involvement.service.ts`).
- [X] **Componentes de Interface (UI):**
  - [X] Adicionar coluna **Identificação** na tabela de relatos com Tags (`Anônimo` / `Identificado`).
  - [X] Adicionar tabela de envolvidos dentro dos formulários/modais de Relato (`EditRecordModal` / `CreateRecordModal`).
  - [X] Seletor para vincular pessoa e definir papel operacional (filtrando pessoas já vinculadas).
  - [X] Ação para remover vínculo de envolvido.
  - [X] Tratamento do cálculo e atualização do status de anonimato do relato.

### 2.3 Bônus & Usabilidade (Diferenciais)
- [ ] Atualizar `Dashboard.page.tsx` com cards e métricas (total de pessoas, proporção de relatos anônimos vs identificados).

---

## Fase 3: Validação, Evidências e Entrega
- [X] **3.1 Testes Manuais dos Cenários Obrigatórios**
  - [X] Teste de criação e listagem de pessoas.
  - [X] Teste de tentativa de duplicidade de CPF (HTTP 409).
  - [X] Teste de vínculo de pessoas e cálculo de relato Anônimo vs Identificado.
  - [X] Teste de tentativa de vincular mesma pessoa duas vezes no mesmo relato (HTTP 409).
- [X] **3.2 Documentação de Evidências**
  - [X] Captura de telas/evidências visuais.
  - [X] Criação do arquivo `EVIDENCES.md` detalhando passos, esperado e obtido.
- [ ] **3.3 Finalização**
  - [ ] Revisão geral do código e commits no repositório.
  - [ ] Preenchimento e envio do formulário oficial de encerramento.
