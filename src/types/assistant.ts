export interface ChatMessageRequest {
  model: string
  search_mode: boolean
  prompt: string
}

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
  type: 'user' | 'ai'
  content: string
  metadata?: {model: string, prompt?: string}
}

export type AssistantMode = 'chat' | 'edit'

export interface AIModel {
  model: string
  label: string
}