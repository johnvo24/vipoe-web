import { Message } from "@/types/assistant";
import { Chain, PoemErrorCode, ReasoningResult } from "./type";

function toPoemErrorCode(code: string): PoemErrorCode {
  if (Object.values(PoemErrorCode).includes(code as PoemErrorCode)) {
    return code as PoemErrorCode;
  }
  throw new Error(`Unknown PoemErrorCode: ${code}`);
}

export function convertAIResponseToReasoningResult(
  rawText: string
): ReasoningResult {
  const extract = (tag: string): string => {
    const regex = new RegExp(
      `<${tag}>\\s*([\\s\\S]*?)\\s*(?=<[a-z]+>|<eoi?s>|$)`,
      "i"
    );
    const match = rawText.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    errorCode: toPoemErrorCode(extract("error")),
    description: extract("desc"),
    reason: extract("reason"),
    action: extract("action"),
    replace: extract("replace"),
    line: Number(extract("line")),
    index: Number(extract("index")),
    effect: extract("effect"),
  };
}

function getErrorIntro(code: PoemErrorCode): string {
  switch (code) {
    case PoemErrorCode.Structure:
      return "Phát hiện lỗi Cấu trúc.";
    case PoemErrorCode.Tone:
      return "Phát hiện lỗi Thanh điệu.";
    case PoemErrorCode.Rhyme:
      return "Phát hiện lỗi Vần.";
    case PoemErrorCode.Meaning:
      return "Phát hiện lỗi Ngữ nghĩa.";
    case PoemErrorCode.Imagery:
      return "Phát hiện lỗi Hình ảnh.";
    case PoemErrorCode.Context:
      return "Phân tích ngữ cảnh:";
    default:
      return "Phát hiện một điểm nhỏ cần chỉnh.";
  }
}

export function reasoningResultToFriendlyMessage(r: ReasoningResult): string {
  if (r.errorCode !== PoemErrorCode.Context)
    return `
⚠️ ${getErrorIntro(r.errorCode)}
Dòng ${r.line}, vị trí ${r.index}: ${r.description}
👉 ${r.reason}
💡 Gợi ý sửa: "${r.action}" thay cho "${r.replace}"
🎯 Hiệu quả: ${r.effect}
  `.trim();
  else {
    return `
ℹ️ ${getErrorIntro(r.errorCode)}
${r.description}
    `.trim();
  }
}

export function convertChainToMessages(chain: Chain) {
  const messages: Message[] = [];
  messages.push({
    id: "original_poem",
    type: "user",
    content: chain.original_poem,
  });
  for (const step of chain.steps) {
    messages.push({
      id: step.step_content,
      type: "ai",
      content: reasoningResultToFriendlyMessage(
        convertAIResponseToReasoningResult(step.step_content)
      ),
    });
  }

  return messages;
}

export function isLastStepEditingComplete(chain: Chain | null): boolean {
  if (!chain) return false;
  if (chain.steps.length === 0) return false;
  const lastStep = chain.steps[chain.steps.length - 1];
  if (
    lastStep.edited_poem !== undefined &&
    lastStep.edited_poem.trim() !== ""
  ) {
    return true;
  }
  if (
    typeof lastStep.step_content === "string" &&
    lastStep.step_content.includes("<eos>")
  ) {
    return true;
  }
  return false;
}
