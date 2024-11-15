import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AITextSession,
  ChatMessageType,
  checkAIAvailability,
  getAICompletion,
} from "@/lib/ai";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    const saved = localStorage.getItem("local-ai-messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<AITextSession>();

  useEffect(() => {
    const setCapabilities = async () => {
      const isAIAvailable = await checkAIAvailability();
      setIsAIAvailable(isAIAvailable);

      if (isAIAvailable) {
        const session = await window.ai.languageModel.create();
        sessionRef.current = session;
      }
    };
    setCapabilities();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "local-ai-messages",
      JSON.stringify(messages.filter((m) => !m.isError)),
    );
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      role: "User",
      timestamp: Date.now(),
      isError: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessage: ChatMessageType = await getAICompletion(
      content,
      sessionRef.current,
    );

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleRetryMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) {
      return;
    }
    const content = messages[messageIndex - 1].content;
    setIsLoading(true);

    const aiMessage: ChatMessageType = await getAICompletion(
      content,
      sessionRef.current,
    );

    setMessages((prev) => {
      prev[messageIndex] = aiMessage;
      return prev;
    });

    setIsLoading(false);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className={cn(
          "bg-background min-h-screen transition-colors duration-200",
          "flex flex-col",
        )}
      >
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              {messages.length > 0 &&
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onRetry={handleRetryMessage} // Pass retry handler
                  />
                ))}
              {messages.length === 0 && (
                <div className="text-center">🤔 There are no messages yet.</div>
              )}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <ChatInput
            onSend={handleSendMessage}
            disabled={!isAIAvailable || isLoading}
          />
        </main>

        {!isAIAvailable && (
          <div className="bg-destructive/90 text-destructive-foreground fixed bottom-20 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-sm">
            AI API not available. Please enable the window.ai feature.
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
