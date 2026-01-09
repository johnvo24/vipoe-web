import { Chain } from "@/app/assistant/type";
import { ChatMessageRequest } from "@/types/assistant";
import { API_ROUTES } from "../routes";
import { api } from "../services";

export async function sendChatMessage(
  token: string,
  payload: ChatMessageRequest
) {
  const response = await api.post(API_ROUTES.ASSISTANT_CHAT, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function sendEditMessage(token: string, payload: Chain) {
  const response = await api.post(API_ROUTES.ASSISTANT_EDIT, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
