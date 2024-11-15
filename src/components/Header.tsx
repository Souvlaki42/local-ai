import { Bot, Trash2Icon } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export const Header = () => {
  const handleDeleteMessages = () => {
    localStorage.removeItem("local-ai-messages");
    window.location.reload();
  };
  return (
    <header className="border-b px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full">
            <Bot size={20} />
          </div>
          <h1 className="text-xl font-semibold">Local AI Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* TODO: Add a confirmation dialog before deleting messages */}
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteMessages}
          >
            <Trash2Icon />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
