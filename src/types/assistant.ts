export interface Step {
  error_poem: string
  step_content: string
  edited_poem: string
  reasoning_score: number
  meaning_score: boolean
  imagery_score: boolean
}

export interface Chain {
  original_poem: string
  steps: Step[]
}

export type Message = {
  id: string
  type: 'user' | 'ai' | 'poem' | 'edited-poem'
  content: string
  metadata?: any
}

export type AssistantMode = 'write' | 'edit'

export interface AIModel {
  model: string
  label: string
}