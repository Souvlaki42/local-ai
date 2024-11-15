import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { FC, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder={
          disabled ? "AI not available in this browser" : "Type a message..."
        }
        className={cn(
          "bg-background flex-1 rounded-lg border px-4 py-2",
          "focus:ring-primary focus:border-transparent focus:outline-none focus:ring-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={cn(
          "rounded-lg px-4 py-2",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
        )}
      >
        <Send size={20} />
      </button>
    </form>
  );
};
