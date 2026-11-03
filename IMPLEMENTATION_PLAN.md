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
- [ ] **Tipagem e Consumo da API no Front-end:**
  - [ ] Modelar tipos TypeScript (`person.type.ts`).
  - [ ] Implementar serviços de consumo da API (`list-people.service.ts`, `find-person.service.ts`, `create-person.service.ts`, `update-person.service.ts`, `delete-person.service.ts`).
  - [ ] Criar contexto de estado (`People.context.tsx`).
- [ ] **Componentes de Interface (UI):**
  - [ ] Tabela de listagem de pessoas (`PersonTable.tsx`) com dados e ações.
  - [ ] Formulário com máscara visual de CPF e validações (`PersonForm.tsx`).
  - [ ] Modal de cadastro de nova pessoa (`CreatePersonModal.tsx`).
  - [ ] Modal de edição de pessoa (`EditPersonModal.tsx`).
  - [ ] Ação de exclusão com confirmação (`Popconfirm`).
  - [ ] Tratamento amigável para erro de CPF duplicado (HTTP 409).
- [ ] **Navegação:**
  - [ ] Adicionar rota `/people` no `router.tsx` e item no menu lateral (`Sider.tsx`).

### 2.2 Épico 2: Gestão de Envolvimentos nos Relatos (`/records`)
- [ ] **Tipagem e Consumo da API no Front-end:**
  - [ ] Modelar tipos de envolvimento e papéis (`whistleblower`, `witness`, `victim`, `denounced`).
  - [ ] Implementar serviços de consumo da API de envolvimentos (`list-record-involvements.service.ts`, `create-record-involvement.service.ts`, `delete-record-involvement.service.ts`).
- [ ] **Componentes de Interface (UI):**
  - [ ] Adicionar coluna **Identificação** na tabela de relatos com Tags (`Anônimo` / `Identificado`).
  - [ ] Adicionar tabela de envolvidos dentro dos formulários/modais de Relato (`EditRecordModal` / `CreateRecordModal`).
  - [ ] Seletor para vincular pessoa e definir papel operacional (filtrando pessoas já vinculadas).
  - [ ] Ação para remover vínculo de envolvido.
  - [ ] Tratamento do cálculo e atualização do status de anonimato do relato.

### 2.3 Bônus & Usabilidade (Diferenciais)
- [ ] Atualizar `Dashboard.page.tsx` com cards e métricas (total de pessoas, proporção de relatos anônimos vs identificados).

---

## Fase 3: Validação, Evidências e Entrega
- [ ] **3.1 Testes Manuais dos Cenários Obrigatórios**
  - [ ] Teste de criação e listagem de pessoas.
  - [ ] Teste de tentativa de duplicidade de CPF (HTTP 409).
  - [ ] Teste de vínculo de pessoas e cálculo de relato Anônimo vs Identificado.
  - [ ] Teste de tentativa de vincular mesma pessoa duas vezes no mesmo relato (HTTP 409).
- [ ] **3.2 Documentação de Evidências**
  - [ ] Captura de telas/evidências visuais.
  - [ ] Criação do arquivo `EVIDENCES.md` detalhando passos, esperado e obtido.
- [ ] **3.3 Finalização**
  - [ ] Revisão geral do código e commits no repositório.
  - [ ] Preenchimento e envio do formulário oficial de encerramento.
