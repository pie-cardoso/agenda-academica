# margem — Agenda de Tarefas Acadêmicas

Front-end em **React + JavaScript + Vite**, com CSS puro, React Router, Lucide React e `localStorage`.
Não há backend: todos os dados ficam no navegador.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # gera a versão de produção em dist/
npm run preview  # testa a versão de produção
```

Requer Node.js 18 ou superior.

## Telas

| Rota | Tela |
|---|---|
| `/` | Início: radar de prazos, próximos passos, aviso de estudo do dia |
| `/tarefas` | Lista com filtros (Todas, A Fazer, Concluídas, Atrasadas) |
| `/tarefas/nova` | Nova tarefa (aceita `?materia=id` para pré-selecionar a disciplina) |
| `/tarefas/:id/editar` | Editar, concluir ou excluir tarefa |
| `/materias` | Busca, cards das matérias e cadastro por modal |
| `/materias/:id/arquivos` · `/links` · `/tarefas` | Detalhe da matéria |
| `/agenda` | Calendário mensal/semanal, agenda do dia, prazos da semana |
| `/foco` | Timer Pomodoro e registro de estudo |

## Estrutura

```
src/
├── App.jsx, main.jsx
├── components/   layout · ui · tasks · subjects · calendar · focus
├── pages/        uma por rota
├── context/      AppDataContext (dados + localStorage), PomodoroContext (timer)
├── services/     storage · seedData · dateUtils · agendaUtils · formatters
└── styles/       tokens (cores, fontes) · global · layout · ui · tasks · subjects · agenda · focus · pages
```

## Como os dados funcionam

- Tudo é salvo em `localStorage` na chave `margem:v1`. Para voltar aos dados fictícios iniciais,
  apague essa chave (DevTools → Application → Local Storage) e atualize a página.
- Os dados fictícios são gerados em relação à data de hoje.
- **Arquivos das matérias:** só os metadados (nome, tipo, tamanho, data) são guardados; a prévia é simulada.
- **Agenda:** aulas vêm dos horários das matérias, entregas vêm das tarefas, provas vêm da matéria,
  e o estudo vem dos ciclos de foco concluídos. Provas e apresentações extras podem ser criadas pelo botão +.
- **Timer:** continua rodando ao trocar de tela, mas recarregar a página zera o tempo em andamento
  (os ciclos já concluídos permanecem salvos).

## Fontes

Fraunces (títulos) e Inter (texto), carregadas pelo Google Fonts em `index.html`.
Para trabalhar offline, instale-as localmente e ajuste `--font-display` e `--font-body` em `src/styles/tokens.css`.
