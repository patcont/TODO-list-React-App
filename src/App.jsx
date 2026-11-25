import { useEffect, useMemo, useRef, useState } from 'react'
import DigitalRain from './components/DigitalRain'
import { FILTERS, initialTodos, todosReducer, visibleTodos } from './todos'
import { useStoredReducer } from './useStoredReducer'
import { quotes } from './quotes'

export default function App() {
  const [todos, dispatch] = useStoredReducer('todos:v2', todosReducer, initialTodos)
  const [mode, setMode] = useState('create') // 'create' | 'search' | 'none'
  const [filter, setFilter] = useState('all')
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])

  // Keyboard shortcuts: "/" search, "N" new item, "Esc" cancel
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target instanceof HTMLInputElement
      if (e.key === 'Escape') {
        setMode('none')
        setQuery('')
        inputRef.current?.blur()
      } else if (!typing && e.key === '/') {
        e.preventDefault()
        setMode('search')
      } else if (!typing && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault()
        setMode('create')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (mode !== 'none') inputRef.current?.focus()
  }, [mode])

  const items = useMemo(
    () => visibleTodos(todos, filter, mode === 'search' ? query : ''),
    [todos, filter, mode, query],
  )
  const left = todos.filter((t) => !t.completed).length
  const done = todos.length - left

  const submit = (e) => {
    e.preventDefault()
    dispatch({ type: 'add', text })
    setText('')
  }

  return (
    <>
      <DigitalRain />
      <main className="terminal">
        <p className="quote">&gt; {quote}_</p>
        <h1 className="glitch" data-text="Things To Do">Things To Do</h1>

        {mode === 'create' && (
          <form onSubmit={submit}>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new task and press Enter"
              aria-label="New task"
            />
          </form>
        )}
        {mode === 'search' && (
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
          />
        )}

        {items.length === 0 ? (
          <p className="empty">No signal. There are no items.</p>
        ) : (
          <ul className="list">
            {items.map((t) => (
              <li key={t.id} className={t.completed ? 'done' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => dispatch({ type: 'toggle', id: t.id })}
                  />
                  <span>{t.text}</span>
                </label>
                <button
                  className="remove"
                  onClick={() => dispatch({ type: 'remove', id: t.id })}
                  aria-label={`Delete ${t.text}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer>
          <div className="modes">
            <button
              className={mode === 'create' ? 'on' : ''}
              onClick={() => setMode(mode === 'create' ? 'none' : 'create')}
              title="New item (N)"
            >
              + New
            </button>
            <button
              className={mode === 'search' ? 'on' : ''}
              onClick={() => setMode(mode === 'search' ? 'none' : 'search')}
              title="Search (/)"
            >
              ⌕ Search
            </button>
          </div>
          <span className="count">{left} left</span>
          <div className="filters">
            {Object.entries(FILTERS).map(([key, label]) => (
              <button key={key} className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
          </div>
        </footer>
        {done > 0 && (
          <button className="clear" onClick={() => dispatch({ type: 'clearCompleted' })}>
            Clear completed ({done})
          </button>
        )}
        <p className="help">
          <kbd>/</kbd> search · <kbd>N</kbd> new · <kbd>Esc</kbd> cancel
        </p>
      </main>
    </>
  )
}
