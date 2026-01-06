"use client";

import AssistantInput from "@/app/assistant/components/AssistantInput";
import AssistantWelcome from "@/app/assistant/components/AssistantWelcome";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  File,
  RefreshCw,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import MessageItem from "./components/MessageItem";
import { TypingIndicator } from "./components/TypingIndicator";
import { useAssistant } from "./hooks";
import {
  convertAIResponseToReasoningResult,
  convertChainToMessages,
  reasoningResultToFriendlyMessage,
} from "./utils";

const PoemAssistant = () => {
  const [input, setInput] = useState("");

  const {
    authLoading,
    messageList,
    chain,
    currentSteps,
    setCurrentSteps,
    selection,
    setSelection,
    onTakeSelection,
    editCompleted,
    endOfMessagesRef,
    handleEditMessage,
    loading,
    mode,
    setMode,
    isSearchMode,
    setIsSearchMode,
    sendMessage,
  } = useAssistant();

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (authLoading) {
    return (
      <div className="main w-full h-screen flex items-center justify-center">
        <Skeleton className="w-full max-w-xl m-auto h-[74px] rounded-full" />
      </div>
    );
  }

  return (
    <div className="poem-assistant-box h-full">
      {(messageList.length > 0 && mode !== "edit") ||
      (chain && mode === "edit") ? (
        <div className="chat-content pb-[200px]">
          {mode !== "edit"
            ? messageList.map((messageData, id) => (
                <MessageItem key={id} messageData={messageData} />
              ))
            : chain &&
              convertChainToMessages(chain).map((messageData, id) => (
                <MessageItem key={id} messageData={messageData} />
              ))}

          {currentSteps.length > 0 && mode == "edit" && !loading && (
            <>
              <MessageItem
                messageData={{
                  id: "999",
                  type: "ai",
                  content: reasoningResultToFriendlyMessage(
                    convertAIResponseToReasoningResult(
                      currentSteps[selection].step_content
                    )
                  ),
                }}
              />

              <div className="px-2 max-sm:px-3">
                <div className="relative w-full max-h-[248px] overflow-scroll border rounded-lg -mt-2 mb-3 bg-gray-50">
                  <button
                    className="flex gap-0.5 items-center absolute top-2 right-3 text-xs text-gray-400 font-bold hover:text-gray-600 active:opacity-80 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        currentSteps[selection].edited_poem || ""
                      );
                    }}
                  >
                    COPY
                    <File className="size-3" />
                  </button>
                  <div className="flex justify-center whitespace-pre-line text-center py-4  text-gray-700 text-sm">
                    {currentSteps[selection].edited_poem}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center px-1 max-sm:px-3">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      setSelection(
                        (prev) =>
                          (prev + currentSteps.length - 1) % currentSteps.length
                      )
                    }
                    className="text-gray-400 cursor-pointer hover:text-gray-900 active:opacity-80"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() =>
                      setSelection((prev) => (prev + 1) % currentSteps.length)
                    }
                    className="text-gray-400 cursor-pointer hover:text-gray-900 active:opacity-80"
                  >
                    <ChevronRight />
                  </button>
                  <p className="select-none text-gray-400 w-[48px] py-1 flex justify-center font-medium text-xs rounded-full bg-gray-100 font-mono">
                    {selection + 1}〡{currentSteps.length}
                  </p>
                </div>

                <button
                  onClick={() => handleEditMessage()}
                  className="text-gray-400 cursor-pointer hover:text-gray-900 active:opacity-80"
                >
                  <RefreshCw size={20} />
                </button>

                <button
                  onClick={() => {
                    setCurrentSteps([]);
                    setSelection(0);
                  }}
                  className="text-gray-400 cursor-pointer hover:text-gray-900 active:opacity-80"
                >
                  <XIcon size={26} />
                </button>

                <button
                  onClick={onTakeSelection}
                  className="bg-orange-300 text-xs flex gap-0.5 items-center py-1 px-2 rounded-full text-gray-900 cursor-pointer hover:bg-orange-300/80 active:opacity-80"
                >
                  ÁP DỤNG
                  <CheckIcon className="size-4" />
                </button>
              </div>
            </>
          )}

          {currentSteps.length <= 0 && mode == "edit" && !loading && (
            <>
              <div className="px-2 max-sm:px-3">
                <div className="relative w-full max-h-[248px] overflow-scroll border rounded-lg -mt-2 mb-3 bg-gray-50">
                  <button
                    className="flex gap-0.5 items-center absolute top-2 right-3 text-xs text-gray-400 font-bold hover:text-gray-600 active:opacity-80 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        chain?.steps[-1]?.edited_poem ||
                          chain?.original_poem ||
                          ""
                      );
                    }}
                  >
                    COPY
                    <File className="size-3" />
                  </button>
                  <div className="flex justify-center whitespace-pre-line text-center py-4  text-gray-700 text-sm">
                    {chain?.steps[-1]?.edited_poem ||
                      chain?.original_poem ||
                      ""}
                  </div>
                </div>
              </div>

              {!editCompleted && (
                <div className="flex w-full justify-end">
                  <Button
                    className="cursor-pointer active:opacity-80"
                    size="sm"
                    onClick={() => handleEditMessage()}
                  >
                    CONTINUE
                  </Button>
                </div>
              )}
            </>
          )}

          {loading && <TypingIndicator />}
          <div ref={endOfMessagesRef} className="h-0"></div>
        </div>
      ) : (
        <AssistantWelcome
          mode={mode}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      <div className="fixed left-0 right-0 bottom-0 max-w-[640px] mx-auto h-[90px] sm:h-[106px] bg-white"></div>
      <AssistantInput
        input={input}
        setInput={setInput}
        mode={mode}
        setMode={setMode}
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
        loading={loading}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default PoemAssistant;
