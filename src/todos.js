// Pure state logic: easy to test, no React needed.

export const FILTERS = { all: 'All', active: 'Active', completed: 'Completed' }

export const initialTodos = [
  { id: 1, text: 'Learn JavaScript', completed: true },
  { id: 2, text: 'Learn React', completed: true },
  { id: 3, text: 'Build a React app', completed: false },
]

export function todosReducer(todos, action) {
  switch (action.type) {
    case 'add': {
      const text = action.text.trim()
      if (!text) return todos
      const id = Math.max(0, ...todos.map((t) => t.id)) + 1
      return [...todos, { id, text, completed: false }]
    }
    case 'toggle':
      return todos.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t))
    case 'remove':
      return todos.filter((t) => t.id !== action.id)
    case 'clearCompleted':
      return todos.filter((t) => !t.completed)
    default:
      return todos
  }
}

export function visibleTodos(todos, filter, query) {
  const q = query.trim().toLowerCase()
  return todos
    .filter((t) => (filter === 'active' ? !t.completed : filter === 'completed' ? t.completed : true))
    .filter((t) => t.text.toLowerCase().includes(q))
}
