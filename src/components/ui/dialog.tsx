import * as React from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}

type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;
function DialogContent({ className, ...props }: DialogContentProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-6 shadow-2xl",
        className
      )}
      {...props}
    />
  );
}

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;
function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div className={cn("mb-4", className)} {...props} />;
}

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <h2
      className={cn("text-xl font-semibold text-gray-50", className)}
      {...props}
    />
  );
}

type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children}
    </button>
  )
);
DialogTrigger.displayName = "DialogTrigger";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger };
