"use client";
import React from "react";
import { Input } from "../../../components/ui/input";
import { useChat } from "ai/react";
import { Button } from "../../../components/ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { cn } from "@/src/lib/utils";
import { Loader2 } from "lucide-react";

// Define the props interface for ChatComponent
interface ChatComponentProps {
  chatId: number;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chatId }) => {
  const { data, isLoading: messagesLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages, isLoading: chatLoading } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Message list component built directly into ChatComponent
  const MessageList = () => {
    if (messagesLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      );
    }

    if (!messages || messages.length === 0) {
      return (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 px-4">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          
          return (
            <div key={index} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-[80%]',
                  isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <MessageList />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;