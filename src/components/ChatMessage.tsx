import { ChatMessageType } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { Bot, Repeat2Icon, User } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/button";

export const ChatMessage: FC<{
  message: ChatMessageType;
  onRetry: (messageId: string) => void;
}> = ({ message: { content, role, timestamp, id }, onRetry }) => {
  const isBot = role === "Assistant";
  return (
    <div
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-4 group relative flex gap-3 rounded-lg p-4",
        isBot && "bg-muted/50",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
          isBot
            ? "bg-primary/20 text-primary"
            : "bg-secondary/20 text-secondary",
        )}
      >
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <p className="text-muted-foreground mb-1 text-sm">
          {isBot ? "AI Assistant" : "You"}
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {content}
        </div>
      </div>
      <time className="text-muted-foreground self-start text-xs">
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>

      {/* Retry Button */}
      {isBot && (
        <Button
          variant="outline"
          size="icon"
          className="invisible absolute bottom-2 right-2 p-1 group-hover:visible"
          onClick={() => onRetry(id)}
        >
          <Repeat2Icon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
