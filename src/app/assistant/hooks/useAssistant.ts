import { sendChatMessage, sendEditMessage } from "@/lib/api/assistant";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/reduxHooks";
import {
  selectAuthLoading,
  selectIsAuthenticated,
  selectToken,
} from "@/lib/store/auth/authSlice";
import { logout } from "@/lib/store/auth/authThunks";
import { AssistantMode, Message } from "@/types/assistant";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Chain, EditStep } from "../type";
import { isLastStepEditingComplete } from "../utils";

const CHAT_MODEL = "auto";

export function useAssistant() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Auth state
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  // Messages state
  const [messageList, setMessageList] = useState<Message[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  // Chat state
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("chat");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [editCompleted, setEditCompleted] = useState(false);
  // Edit state
  const [chain, setChain] = useState<Chain | null>(null);
  const [currentSteps, setCurrentSteps] = useState<EditStep[]>([]);
  const [selection, setSelection] = useState<number>(0);

  // Auth redirect
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, authLoading, router]);

  // Auto-scroll khi có tin nhắn mới
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleUnauthorized = () => {
    dispatch(logout());
    router.push("/sign-in");
  };

  const addMessage = (message: Omit<Message, "id">) => {
    setMessageList((prev) => [
      ...prev,
      { ...message, id: Date.now().toString() },
    ]);
  };

  const clearMessages = () => {
    setMessageList([]);
  };

  const onTakeSelection = () => {
    setChain((prevChain) => {
      if (!prevChain) return prevChain;
      const newSteps = [...prevChain.steps, currentSteps[selection]];
      return { ...prevChain, steps: newSteps };
    });
    setEditCompleted(isLastStepEditingComplete(chain));
    setCurrentSteps([]);
    setSelection(0);
  };

  const handleChatMessage = async (userMessage: string) => {
    addMessage({ type: "user", content: userMessage });
    setLoading(true);

    try {
      if (!token) {
        handleUnauthorized();
        return;
      }

      const payload = {
        model: CHAT_MODEL,
        search_mode: isSearchMode,
        prompt: userMessage,
      };

      const resData = await sendChatMessage(token, payload);

      addMessage({
        type: "ai",
        content: resData.answer,
        metadata: { model: CHAT_MODEL, prompt: userMessage },
      });
    } catch (error) {
      console.error("Chat Message Send Error:", error);
      addMessage({
        type: "ai",
        content:
          "Oops! Something went wrong while processing your message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMessage = async (message?: string) => {
    setLoading(true);

    try {
      if (!token) {
        handleUnauthorized();
        return;
      }

      const payload = {
        model: "vpec-qwen3",
        original_poem: chain?.original_poem || message || "",
        steps: chain?.steps || [],
      };

      const resData = await sendEditMessage(token, payload);

      setCurrentSteps(resData.steps);
    } catch (error) {
      console.error("Edit Message Send Error:", error);
      addMessage({
        type: "ai",
        content:
          "Oops! Something went wrong while processing your message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    if (mode === "chat") {
      await handleChatMessage(message);
    } else {
      setEditCompleted(false);
      setChain({ original_poem: message, steps: [] });

      await new Promise((resolve) => setTimeout(resolve, 0));

      await handleEditMessage(message);
    }
  };

  return {
    // Auth
    token,
    isAuthenticated,
    authLoading,
    // Messages
    messageList,
    chain,
    endOfMessagesRef,

    currentSteps,
    setCurrentSteps,
    selection,
    setSelection,
    onTakeSelection,
    editCompleted,

    handleEditMessage,
    clearMessages,
    // Chat
    loading,
    mode,
    setMode,
    isSearchMode,
    setIsSearchMode,
    sendMessage,
  };
}
