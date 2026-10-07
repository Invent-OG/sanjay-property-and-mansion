import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  labels: Record<string, React.ReactNode>;
  registerLabel: (val: string, label: React.ReactNode) => void;
  getLabel: (val: string) => React.ReactNode | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({});
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : internalValue;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const handleValueChange = React.useCallback(
    (newVal: string) => {
      if (!isValueControlled) {
        setInternalValue(newVal);
      }
      onValueChange?.(newVal);
      if (!isOpenControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    },
    [isValueControlled, onValueChange, isOpenControlled, onOpenChange]
  );

  const setOpen = React.useCallback(
    (action: React.SetStateAction<boolean>) => {
      const next = typeof action === 'function' ? action(open) : action;
      if (!isOpenControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isOpenControlled, open, onOpenChange]
  );

  const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
    setLabels((prev) => (prev[val] === label ? prev : { ...prev, [val]: label }));
  }, []);

  const getLabel = React.useCallback(
    (val: string) => {
      if (!val) return undefined;
      if (labels[val] !== undefined) return labels[val];
      const valLower = String(val).toLowerCase();
      for (const [k, node] of Object.entries(labels)) {
        if (k.toLowerCase() === valLower) {
          return node;
        }
      }
      return undefined;
    },
    [labels]
  );

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        labels,
        registerLabel,
        getLabel,
        triggerRef,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-1", className)} {...props} />
));
SelectGroup.displayName = "SelectGroup";

function capitalizeWords(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  const matchedLabel = context.getLabel(context.value);
  const fallbackDisplay = context.value ? capitalizeWords(String(context.value)) : placeholder;
  const currentDisplay = matchedLabel || fallbackDisplay;

  return (
    <span
      ref={ref}
      className={cn("truncate block", !context.value && "text-neutral-500", className)}
      {...props}
    >
      {currentDisplay}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

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
      role="combobox"
      aria-expanded={context.open}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/90 px-3 py-2 text-xs text-neutral-100 shadow-sm ring-offset-background placeholder:text-neutral-500",
        "focus:outline-none focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-1.5 transition-transform duration-200" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

function hasMatchingValue(nodes: React.ReactNode, targetVal: string): boolean {
  if (!targetVal) return true;
  let found = false;
  React.Children.forEach(nodes, (node) => {
    if (found || !React.isValidElement(node)) return;
    const props = node.props as any;
    if (props?.value !== undefined && String(props.value).toLowerCase() === String(targetVal).toLowerCase()) {
      found = true;
      return;
    }
    if (props?.children) {
      if (hasMatchingValue(props.children, targetVal)) {
        found = true;
      }
    }
  });
  return found;
}

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: "popper" | "item-aligned" }
>(({ className, children, position = "popper", style, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const calculateCoords = React.useCallback(() => {
    if (!context?.triggerRef.current || typeof window === "undefined") return null;
    const rect = context.triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < dropdownHeight && rect.top > spaceBelow;

    const width = Math.max(rect.width, 130);
    let left = rect.left;
    if (left + width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - width - 12);
    }
    if (left < 12) left = 12;

    return {
      top: placeAbove ? undefined : rect.bottom + 4,
      bottom: placeAbove ? window.innerHeight - rect.top + 4 : undefined,
      left,
      width,
      placeAbove,
    };
  }, [context?.triggerRef]);

  const [coords, setCoords] = React.useState(calculateCoords);

  const hasActiveInList = React.useMemo(() => {
    if (!context?.value) return true;
    return hasMatchingValue(children, context.value);
  }, [children, context?.value]);

  React.useImperativeHandle(ref, () => contentRef.current!);

  React.useEffect(() => {
    if (!context?.open) {
      return;
    }

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
      style={{
        position: "fixed",
        top: coords?.placeAbove ? undefined : (coords?.top ?? 0),
        bottom: coords?.placeAbove ? (coords?.bottom ?? 0) : undefined,
        left: coords?.left ?? 0,
        width: coords?.width ? `${coords.width}px` : undefined,
        minWidth: "8rem",
        zIndex: 99999,
        ...style,
      }}
      className={cn(
        "max-h-60 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl",
        "animate-in fade-in-0 zoom-in-95",
        coords?.placeAbove ? "slide-in-from-bottom-2" : "slide-in-from-top-2",
        className
      )}
      {...props}
    >
      <div className="p-1">
        {children}
        {!hasActiveInList && context?.value && (
          <SelectItem value={context.value}>
            {capitalizeWords(String(context.value))}
          </SelectItem>
        )}
      </div>
    </div>
  );

  return createPortal(contentElement, document.body);
});
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2.5 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
>(({ className, children, value, disabled, onClick, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  const isSelected =
    context.value !== undefined &&
    value !== undefined &&
    String(context.value).toLowerCase() === String(value).toLowerCase();

  React.useEffect(() => {
    context.registerLabel(value, children);
  }, [value, children, context.registerLabel]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    context.onValueChange(value);
  };

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-xs outline-none transition-colors",
        "hover:bg-neutral-800 hover:text-white focus:bg-neutral-800 focus:text-white",
        isSelected && "bg-neutral-800/80 text-[#FFCC00] font-medium",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center text-[#FFCC00]">
          <Check className="h-4 w-4" />
        </span>
      )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-neutral-800", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
