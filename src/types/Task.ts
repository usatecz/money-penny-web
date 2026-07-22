export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'in-progress' | 'completed'

export interface Task {
  id: string
  reminderDay: string
  startDay: string
  deadline: string
  priority: TaskPriority
  title: string
  description: string
  status: TaskStatus
  tags: string[]
}
