import { addDays, toISODate } from './dateUtils.js'

// Dados fictícios gerados em relação a hoje, para que
// "Vence hoje", "Vence amanhã" e "Atrasada" sempre apareçam.
export function buildSeedData() {
  const day = (n) => toISODate(addDays(n))
  const ago = (n) => addDays(-n).toISOString()

  const subjects = [
    {
      id: 'calculo', name: 'Cálculo', symbol: 'ƒ', color: 'lilac', professor: 'Profa. Helena Costa',
      days: [1, 3], start: '10:00', end: '11:40', room: 'Sala B204',
      exam: { title: 'Derivadas', date: day(2), time: '10:00', room: 'Sala B204', description: 'Regra de derivação, regra da cadeia e aplicações. Revise o resumo na aba Arquivos.' },
      files: [
        { id: 'f1', name: 'Resumo — Derivadas.pdf', type: 'pdf', size: 1258291, pages: 4, addedAt: ago(3) },
        { id: 'f2', name: 'Lista 04 — Derivadas.pdf', type: 'pdf', size: 491520, pages: 2, addedAt: ago(4) },
      ],
      links: [
        { id: 'l1', title: 'Introdução às derivadas', url: 'https://pt.khanacademy.org', type: 'site', description: 'Explore taxas de variação, retas tangentes e exercícios de derivadas no seu ritmo.', tags: ['Leitura + exercícios', 'Gratuito'] },
        { id: 'l2', title: 'Regra da cadeia, sem mistério', url: 'https://www.youtube.com', type: 'video', description: 'Videoaula curta com exemplos resolvidos passo a passo.', tags: ['Vídeo'] },
        { id: 'l3', title: 'Calculadora gráfica', url: 'https://www.geogebra.org', type: 'site', description: 'Ferramenta interativa para plotar funções e ver derivadas.', tags: ['Ferramenta'] },
      ],
    },
    { id: 'biologia', name: 'Biologia', symbol: 'β', color: 'green', professor: 'Prof. Rafael Lima', days: [2, 4], start: '08:00', end: '09:40', room: 'Laboratório 02', exam: null, files: [], links: [] },
    { id: 'computacao', name: 'Computação', symbol: '</>', color: 'blue', professor: 'Profa. Ana Martins', days: [1, 5], start: '14:00', end: '15:40', room: 'Laboratório 05', exam: null, files: [], links: [] },
    { id: 'artes', name: 'Artes', symbol: 'A', color: 'peach', professor: 'Prof. Lucas Melo', days: [2, 4], start: '16:00', end: '17:40', room: 'Ateliê 03', exam: null, files: [], links: [] },
  ]

  const tasks = [
    { id: 't1', title: 'Estudo de composição',  subjectId: 'artes',      description: 'Finalizar o estudo de cores e enviar as fotos.', dueDate: day(-1), dueTime: '18:00', done: false },
    { id: 't2', title: 'Lista 04 — Derivadas',  subjectId: 'calculo',    description: 'Resolver os exercícios 1 a 12 sobre regras de derivação. Enviar a resolução em PDF pelo portal da turma.', dueDate: day(0), dueTime: '18:00', done: false },
    { id: 't3', title: 'Relatório de laboratório', subjectId: 'biologia', description: 'Escrever resultados e conclusão do experimento de células.', dueDate: day(1), dueTime: '18:00', done: false },
    { id: 't4', title: 'Projeto de algoritmos', subjectId: 'computacao', description: 'Implementar a busca binária e entregar o repositório.', dueDate: day(4), dueTime: '23:59', done: false },
    { id: 't5', title: 'Revisar mitose e meiose', subjectId: 'biologia', description: '', dueDate: day(-2), dueTime: '17:00', done: true, doneAt: addDays(-2).toISOString() },
  ]

  // Eventos criados pelo usuário (provas vêm da matéria; entregas vêm das tarefas)
  const events = [
    { id: 'e1', type: 'apresentacao', title: 'Portfólio de Artes', subjectId: 'artes', date: day(3), time: '19:00' },
  ]

  // Registros de estudo de hoje (o Foco da etapa 5 passa a gravar aqui)
  const todayAt = (h, m) => { const d = new Date(); d.setHours(h, m, 0, 0); return d.toISOString() }
  const focusSessions = [
    { id: 's1', subjectId: 'calculo', taskId: 't2', mode: 'focus', minutes: 25, startedAt: todayAt(8, 0),  endedAt: todayAt(8, 25) },
    { id: 's2', subjectId: 'calculo', taskId: 't2', mode: 'focus', minutes: 25, startedAt: todayAt(8, 30), endedAt: todayAt(8, 55) },
  ]

  return { user: { name: 'Aluno' }, subjects, tasks, events, focusSessions, agendaSeeded: true }
}
