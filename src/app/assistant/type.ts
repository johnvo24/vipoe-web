export enum PoemErrorCode {
  Structure = "SE",
  Tone = "TE",
  Rhyme = "RE",
  Meaning = "ME",
  Imagery = "IE",
  Context = "CONTEXT",
}

export type ReasoningResult = {
  errorCode: PoemErrorCode;
  description: string;
  reason: string;
  action: string;
  replace: string;
  line: number;
  index: number;
  effect: string;
};

export type Chain = {
  original_poem: string;
  steps: EditStep[];
};

export type EditStep = {
  error_poem: string;
  step_content: string;
  edited_poem: string;
};
