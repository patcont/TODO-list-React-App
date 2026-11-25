import { describe, it, expect } from 'vitest'
import { todosReducer, visibleTodos } from './todos'

const base = [
  { id: 1, text: 'Learn React', completed: true },
  { id: 2, text: 'Ship it', completed: false },
]

describe('todosReducer', () => {
  it('adds trimmed items with a new id and ignores blanks', () => {
    const next = todosReducer(base, { type: 'add', text: '  Wake up, Neo  ' })
    expect(next.at(-1)).toEqual({ id: 3, text: 'Wake up, Neo', completed: false })
    expect(todosReducer(base, { type: 'add', text: '   ' })).toBe(base)
  })

  it('toggles, removes and clears completed', () => {
    expect(todosReducer(base, { type: 'toggle', id: 2 })[1].completed).toBe(true)
    expect(todosReducer(base, { type: 'remove', id: 1 })).toHaveLength(1)
    expect(todosReducer(base, { type: 'clearCompleted' })).toEqual([base[1]])
  })
})

describe('visibleTodos', () => {
  it('filters by status and search query', () => {
    expect(visibleTodos(base, 'active', '')).toEqual([base[1]])
    expect(visibleTodos(base, 'completed', '')).toEqual([base[0]])
    expect(visibleTodos(base, 'all', 'REACT')).toEqual([base[0]])
  })
})
