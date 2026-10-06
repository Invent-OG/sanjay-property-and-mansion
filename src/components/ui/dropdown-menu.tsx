import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

const DropdownMenu: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next = typeof value === 'function' ? value(open) : value;
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, open, onOpenChange]
  );

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, onClick, asChild, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  const setMergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      if (context.triggerRef) {
        (context.triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
    },
    [context.triggerRef, ref]
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      context.setOpen((prev) => !prev);
    }
  };

  return (
    <button
      ref={setMergedRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={context.open}
      className={cn("inline-flex items-center justify-center cursor-pointer select-none", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn("p-1", className)}>{children}</div>;

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end" }
>(({ className, align = "end", style, children, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const calculateCoords = React.useCallback(() => {
    if (!context?.triggerRef.current || typeof window === "undefined") return null;
    const rect = context.triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < dropdownHeight && rect.top > spaceBelow;

    const estimatedWidth = 220;
    let left = rect.left;
    if (align === "end") {
      left = rect.right - estimatedWidth;
    } else if (align === "center") {
      left = rect.left + rect.width / 2 - estimatedWidth / 2;
    }

    if (left + estimatedWidth > window.innerWidth - 12) {
      left = window.innerWidth - estimatedWidth - 12;
    }
    if (left < 12) left = 12;

    return {
      top: placeAbove ? undefined : rect.bottom + 6,
      bottom: placeAbove ? window.innerHeight - rect.top + 6 : undefined,
      left,
      placeAbove,
    };
  }, [context?.triggerRef, align]);

  const [coords, setCoords] = React.useState(calculateCoords);

  React.useImperativeHandle(ref, () => contentRef.current!);

  React.useEffect(() => {
    if (!context?.open) return;

    setCoords(calculateCoords());

    const updateCoords = () => {
      setCoords(calculateCoords());
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        context.triggerRef.current &&
        !context.triggerRef.current.contains(target)
      ) {
        context.setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        context.setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [context?.open, calculateCoords, context]);

  if (!context?.open || typeof document === "undefined") return null;

  const contentElement = (
    <div
      ref={contentRef}
      role="menu"
      style={{
        position: "fixed",
        top: coords?.placeAbove ? undefined : (coords?.top ?? 0),
        bottom: coords?.placeAbove ? (coords?.bottom ?? 0) : undefined,
        left: coords?.left ?? 0,
        minWidth: "12rem",
        zIndex: 99999,
        ...style,
      }}
      className={cn(
        "max-h-[85vh] overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 p-1 text-neutral-100 shadow-2xl",
        "animate-in fade-in-0 zoom-in-95",
        coords?.placeAbove ? "slide-in-from-bottom-2" : "slide-in-from-top-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  return createPortal(contentElement, document.body);
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean;
    disabled?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, disabled, destructive, onClick, children, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    context?.setOpen(false);
  };

  return (
    <div
      ref={ref}
      role="menuitem"
      aria-disabled={disabled}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2.5 py-1.5 text-xs outline-none transition-colors",
        "hover:bg-neutral-800 hover:text-white focus:bg-neutral-800 focus:text-white",
        destructive && "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300",
        disabled && "pointer-events-none opacity-50",
        inset && "pl-8",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2.5 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-neutral-800", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
};
