import { useState } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../types/Task'

interface DiaryPageProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
}

const emptyTask = (): Omit<Task, 'id'> => ({
  reminderDay: '',
  startDay: '',
  deadline: '',
  priority: 'medium',
  title: '',
  description: '',
  status: 'pending',
  tags: [],
})

const pageTitleStyle: React.CSSProperties = {
  margin: '0 0 1.5rem',
  fontSize: '1.75rem',
  fontWeight: 600,
  color: '#1a1a2e',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
  padding: '1.5rem',
  marginBottom: '1rem',
}

const taskHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
  marginBottom: '0.75rem',
}

const taskTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#1a1a2e',
}

const taskDescriptionStyle: React.CSSProperties = {
  margin: '0 0 0.75rem',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  color: '#4b5563',
  whiteSpace: 'pre-wrap',
}

const metaGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: '0.5rem 1rem',
  fontSize: '0.85rem',
  color: '#555',
  marginBottom: '0.75rem',
}

const tagListStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
}

const tagStyle: React.CSSProperties = {
  background: '#f3f4f6',
  color: '#374151',
  padding: '0.2rem 0.55rem',
  borderRadius: '999px',
  fontSize: '0.75rem',
}

const priorityColors: Record<TaskPriority, string> = {
  low: '#059669',
  medium: '#d97706',
  high: '#dc2626',
}

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
}

const smallButtonStyle: React.CSSProperties = {
  padding: '0.35rem 0.75rem',
  background: '#fff',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  color: '#374151',
}

const primaryButtonStyle: React.CSSProperties = {
  ...smallButtonStyle,
  background: '#1a1a2e',
  borderColor: '#1a1a2e',
  color: '#fff',
}

const dangerButtonStyle: React.CSSProperties = {
  ...smallButtonStyle,
  color: '#b91c1c',
  borderColor: '#fecaca',
}

const formCardStyle: React.CSSProperties = {
  ...cardStyle,
  marginTop: '1.5rem',
}

const fieldStyle: React.CSSProperties = {
  marginBottom: '1rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.35rem',
  fontSize: '0.85rem',
  fontWeight: 500,
  color: '#555',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '0.9rem',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '5rem',
  resize: 'vertical',
  fontFamily: 'inherit',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
}

const addButtonStyle: React.CSSProperties = {
  marginBottom: '1rem',
  padding: '0.65rem 1.25rem',
  background: '#1a1a2e',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 500,
  cursor: 'pointer',
}

function formatDate(value: string) {
  if (!value) return '—'
  return new Date(value + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function DiaryPage({ tasks, onTasksChange }: DiaryPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyTask())

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyTask())
    setShowForm(true)
  }

  const openEditForm = (task: Task) => {
    setEditingId(task.id)
    setForm({
      reminderDay: task.reminderDay,
      startDay: task.startDay,
      deadline: task.deadline,
      priority: task.priority,
      title: task.title,
      description: task.description,
      status: task.status,
      tags: task.tags,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyTask())
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const taskData: Task = {
      id: editingId ?? crypto.randomUUID(),
      ...form,
    }

    if (editingId) {
      onTasksChange(tasks.map((t) => (t.id === editingId ? taskData : t)))
    } else {
      onTasksChange([...tasks, taskData])
    }

    closeForm()
  }

  const handleDelete = (id: string) => {
    onTasksChange(tasks.filter((t) => t.id !== id))
    if (editingId === id) closeForm()
  }

  return (
    <div>
      <h2 style={pageTitleStyle}>Diary</h2>

      <button type="button" style={addButtonStyle} onClick={openAddForm}>
        Add task
      </button>

      {tasks.length === 0 && (
        <p style={{ color: '#666' }}>No tasks yet. Add one to get started.</p>
      )}

      {tasks.map((task) => (
        <div key={task.id} style={cardStyle}>
          <div style={taskHeaderStyle}>
            <h3 style={taskTitleStyle}>{task.title}</h3>
            <div style={buttonRowStyle}>
              <button
                type="button"
                style={smallButtonStyle}
                onClick={() => openEditForm(task)}
              >
                Edit
              </button>
              <button
                type="button"
                style={dangerButtonStyle}
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>

          {task.description && (
            <p style={taskDescriptionStyle}>{task.description}</p>
          )}

          <div style={metaGridStyle}>
            <span>
              <strong>Reminder:</strong> {formatDate(task.reminderDay)}
            </span>
            <span>
              <strong>Start:</strong> {formatDate(task.startDay)}
            </span>
            <span>
              <strong>Deadline:</strong> {formatDate(task.deadline)}
            </span>
            <span style={{ color: priorityColors[task.priority] }}>
              <strong>Priority:</strong> {task.priority}
            </span>
            <span>
              <strong>Status:</strong> {task.status}
            </span>
          </div>

          {task.tags.length > 0 && (
            <div style={tagListStyle}>
              {task.tags.map((tag) => (
                <span key={tag} style={tagStyle}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      {showForm && (
        <div style={formCardStyle}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>
            {editingId ? 'Edit task' : 'New task'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={fieldStyle}>
              <label htmlFor="task-title" style={labelStyle}>
                Title
              </label>
              <input
                id="task-title"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Short task name"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="task-description" style={labelStyle}>
                Description
              </label>
              <textarea
                id="task-description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Detailed notes about what needs to be done"
                rows={4}
                style={textareaStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="task-reminder" style={labelStyle}>
                Reminder day
              </label>
              <input
                id="task-reminder"
                type="date"
                value={form.reminderDay}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, reminderDay: e.target.value }))
                }
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="task-start" style={labelStyle}>
                Start day
              </label>
              <input
                id="task-start"
                type="date"
                value={form.startDay}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startDay: e.target.value }))
                }
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="task-deadline" style={labelStyle}>
                Deadline
              </label>
              <input
                id="task-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, deadline: e.target.value }))
                }
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="task-priority" style={labelStyle}>
                Priority
              </label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: e.target.value as TaskPriority,
                  }))
                }
                style={selectStyle}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label htmlFor="task-status" style={labelStyle}>
                Status
              </label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as TaskStatus,
                  }))
                }
                style={selectStyle}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label htmlFor="task-tags" style={labelStyle}>
                Tags (comma-separated)
              </label>
              <input
                id="task-tags"
                value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="work, personal"
                style={inputStyle}
              />
            </div>

            <div style={buttonRowStyle}>
              <button type="submit" style={primaryButtonStyle}>
                {editingId ? 'Update' : 'Add'}
              </button>
              <button type="button" style={smallButtonStyle} onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
