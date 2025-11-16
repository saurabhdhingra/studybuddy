"use client";
import { useState, useCallback, useEffect } from "react";
import { type Message } from "ai";

// Defines the custom hook's return structure
interface UseStreamChat {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

// Custom hook to handle chat logic including initial history sync and streaming
export const useStreamChat = (
  chatId: number,
  initialMessages: Message[] | undefined
): UseStreamChat => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(true);

  // 1. Synchronize initial messages when they finish loading
  useEffect(() => {
    if (initialMessages && isSyncing) {
      setMessages(initialMessages);
      setIsSyncing(false);
    }
  }, [initialMessages, isSyncing]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
      };

      // Optimistically update the message list with the user's message
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      const streamingAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      try {
        // Post the current chat history + new message to the API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage], // Send full context for the LLM
            chatId,
          }),
        });

        if (!response.body) throw new Error("No response body from stream");

        // Start adding the assistant's message to the UI
        setMessages((prev) => [...prev, streamingAssistantMessage]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamContent = "";

        // Function to process the stream chunks
        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            
            // The API response is an EventSource stream (data: ...\n\n)
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.content || '';
                  if (content) {
                    streamContent += content;
                    
                    // Update the last message's content in real-time
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        // Always update the content of the very last message (the streaming assistant message)
                        newMessages[newMessages.length - 1].content = streamContent;
                        return newMessages;
                    });
                  }
                } catch (e) {
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }
        };

        await processStream();
        
      } catch (error) {
        console.error("Chat streaming error:", error);
        // Handle error state if needed
      }
    },
    [input, chatId, messages] // Include 'messages' to ensure correct context is sent
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  };
};