import { useEffect, useMemo, useState } from 'react'

const initialTasks = [
  {
    id: 1,
    title: 'Reactの画面を確認する',
    priority: 'normal',
    done: true,
  },
  {
    id: 2,
    title: '今日やることを3つ決める',
    priority: 'high',
    done: false,
  },
  {
    id: 3,
    title: 'アプリをNetlifyで公開する',
    priority: 'low',
    done: false,
  },
]

const priorityLabels = {
  high: '重要',
  normal: 'ふつう',
  low: 'あとで',
}

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('study-task-manager')

      if (savedTasks) {
        return JSON.parse(savedTasks)
      }
    } catch {
      console.log('保存されたタスクを読み込めませんでした')
    }

    return initialTasks
  })

  const [newTask, setNewTask] = useState('')
  const [priority, setPriority] = useState('normal')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('study-task-manager', JSON.stringify(tasks))
  }, [tasks])

  const completedCount = tasks.filter((task) => task.done).length
  const remainingCount = tasks.length - completedCount

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100)

  const filteredTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.done)
    }

    if (filter === 'completed') {
      return tasks.filter((task) => task.done)
    }

    return tasks
  }, [tasks, filter])

  const addTask = (event) => {
    event.preventDefault()

    const trimmedTask = newTask.trim()

    if (!trimmedTask) {
      return
    }

    const task = {
      id: Date.now(),
      title: trimmedTask,
      priority,
      done: false,
    }

    setTasks((currentTasks) => [task, ...currentTasks])
    setNewTask('')
    setPriority('normal')
  }

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id),
    )
  }

  const clearCompletedTasks = () => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => !task.done),
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">✅</div>
          <div>
            <p className="brand-name">Study Tasks</p>
            <p className="brand-subtitle">楽しく学ぶタスク管理</p>
          </div>
        </div>

        <div className="header-badge">今日も一歩前進！</div>
      </header>

      <main>
        <section className="hero-card">
          <div className="hero-text">
            <p className="eyebrow">TODAY&apos;S MISSION</p>
            <h1>今日のタスクを<br />片付けよう！</h1>
            <p className="hero-message">
              小さなタスクを一つずつ終わらせると、<br />
              大きな目標に近づけます。
            </p>
          </div>

          <div className="progress-card">
            <div className="progress-circle">
              <span>{progress}%</span>
            </div>
            <p>今日の達成率</p>
            <strong>
              {completedCount} / {tasks.length} 完了
            </strong>
          </div>
        </section>

        <section className="summary-grid">
          <div className="summary-item">
            <span className="summary-icon purple">📋</span>
            <div>
              <span>すべて</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="summary-item">
            <span className="summary-icon orange">🔥</span>
            <div>
              <span>残り</span>
              <strong>{remainingCount}</strong>
            </div>
          </div>

          <div className="summary-item">
            <span className="summary-icon green">🎉</span>
            <div>
              <span>完了済み</span>
              <strong>{completedCount}</strong>
            </div>
          </div>
        </section>

        <section className="task-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MY TASKS</p>
              <h2>やることリスト</h2>
            </div>
            <span className="task-count">{tasks.length} tasks</span>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <input
              type="text"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="新しいタスクを入力してください"
              aria-label="新しいタスク"
            />

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              aria-label="優先度"
            >
              <option value="high">重要</option>
              <option value="normal">ふつう</option>
              <option value="low">あとで</option>
            </select>

            <button className="add-button" type="submit">
              ＋ 追加
            </button>
          </form>

          <div className="task-toolbar">
            <div className="filter-buttons">
              <button
                type="button"
                className={filter === 'all' ? 'filter-button active' : 'filter-button'}
                onClick={() => setFilter('all')}
              >
                すべて
              </button>

              <button
                type="button"
                className={filter === 'active' ? 'filter-button active' : 'filter-button'}
                onClick={() => setFilter('active')}
              >
                未完了
              </button>

              <button
                type="button"
                className={filter === 'completed' ? 'filter-button active' : 'filter-button'}
                onClick={() => setFilter('completed')}
              >
                完了済み
              </button>
            </div>

            <button
              type="button"
              className="clear-button"
              onClick={clearCompletedTasks}
              disabled={completedCount === 0}
            >
              完了済みを削除
            </button>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌱</div>
                <h3>タスクはありません</h3>
                <p>新しいタスクを追加してみましょう！</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  className={task.done ? 'task-item completed' : 'task-item'}
                  key={task.id}
                >
                  <button
                    type="button"
                    className={task.done ? 'check-button checked' : 'check-button'}
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.done ? '未完了に戻す' : '完了にする'}
                  >
                    {task.done ? '✓' : ''}
                  </button>

                  <div className="task-content">
                    <p className="task-title">{task.title}</p>
                    <span className={`priority-tag ${task.priority}`}>
                      {priorityLabels[task.priority]}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`${task.title}を削除`}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>💡</span>
        タスクを完了すると自動的に保存されます
      </footer>
    </div>
  )
}

export default App
