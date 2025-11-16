"use client";
import React from "react";
import { Input } from "../../../components/ui/input";
import { type Message } from "ai"; // Keep Message type imported from 'ai'
import { Button } from "../../../components/ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useStreamChat } from "../../lib/useStreamChat"; // 🎯 FIX 1: Import custom hook

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  // 1. Fetch initial chat history using react-query
  const { data: initialMessages, isLoading: isLoadingHistory } = useQuery<
    Message[]
  >({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
    enabled: !!chatId,
  });

  // 2. Use the custom streaming hook for chat interaction
  const { input, handleInputChange, handleSubmit, messages } = useStreamChat(
    chatId,
    initialMessages
  );

  // The loading state passed to MessageList should reflect if history is still loading.
  const isInitialLoading = isLoadingHistory;

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      // Use requestAnimationFrame for smoother scrolling after content updates
      requestAnimationFrame(() => {
        messageContainer.scrollTo({
          top: messageContainer.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages]);

  return (
    // FIX 3: Change to h-full to correctly inherit height from the ChatPage layout
    <div
      className="relative h-full overflow-y-auto" 
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit z-10 border-b border-gray-200">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      {/* Pass the loading state for history check */}
      <MessageList messages={messages} isLoading={isInitialLoading} />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white z-10 border-t border-gray-200"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button type="submit" className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;