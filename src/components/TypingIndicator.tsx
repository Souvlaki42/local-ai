export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 p-4">
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-primary h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-sm">AI is thinking...</span>
    </div>
  );
};
