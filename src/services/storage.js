// Camada fina sobre o localStorage: toda leitura/escrita passa por aqui.
const KEY = 'margem:v1'

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // armazenamento cheio ou bloqueado: o app continua funcionando em memória
  }
}

export function resetData() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
