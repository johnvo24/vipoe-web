export const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-1 p-2">
      <div className="vi-text vi-text-second mr-0.5">Typing</div>
      <div className="size-[3px] bg-muted-foreground rounded-full animate-bounce delay-150 mb-[5px]" />
      <div className="size-[3px] bg-muted-foreground rounded-full animate-bounce delay-300 mb-[5px]" />
      <div className="size-[3px] bg-muted-foreground rounded-full animate-bounce delay-450 mb-[5px]" />
    </div>
  );
};
