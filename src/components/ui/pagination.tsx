import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "./button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"button">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : "outline",
        size,
      }),
      "h-8 w-8 text-xs font-semibold cursor-pointer select-none",
      isActive
        ? "bg-[#FFCC00] text-black hover:bg-[#FFCC00]/90 font-bold border-transparent"
        : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800 hover:text-white",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      "gap-1 pl-2.5 pr-3 h-8 w-auto text-xs font-medium",
      disabled && "opacity-40 pointer-events-none cursor-not-allowed",
      className
    )}
    disabled={disabled}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="hidden sm:inline">Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      "gap-1 pl-3 pr-2.5 h-8 w-auto text-xs font-medium",
      disabled && "opacity-40 pointer-events-none cursor-not-allowed",
      className
    )}
    disabled={disabled}
    {...props}
  >
    <span className="hidden sm:inline">Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-8 w-8 items-center justify-center text-neutral-500", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: DataTablePaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-neutral-800/80 bg-neutral-950/40 text-xs",
        className
      )}
    >
      {/* Left: Summary and Page Size */}
      <div className="flex flex-wrap items-center gap-3 text-neutral-400">
        <div>
          Showing <span className="font-semibold text-white">{startItem}</span> to{" "}
          <span className="font-semibold text-white">{endItem}</span> of{" "}
          <span className="font-bold text-[#FFCC00]">{totalItems}</span> entries
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-800">
            <span className="text-neutral-500 text-[11px]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-neutral-900 border border-neutral-700/80 rounded px-2 py-0.5 text-xs text-neutral-200 focus:outline-none focus:border-[#FFCC00] cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-1">
        <Pagination>
          <PaginationContent>
            {/* First Page Button (desktop) */}
            <PaginationItem className="hidden md:inline-flex">
              <PaginationLink
                size="icon"
                onClick={() => onPageChange(1)}
                disabled={currentPage <= 1}
                className={cn(
                  "h-8 w-8",
                  currentPage <= 1 && "opacity-40 pointer-events-none"
                )}
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>

            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              />
            </PaginationItem>

            {/* Page Number Buttons */}
            {getPageNumbers().map((p, idx) =>
              p === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={currentPage === p}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              />
            </PaginationItem>

            {/* Last Page Button (desktop) */}
            <PaginationItem className="hidden md:inline-flex">
              <PaginationLink
                size="icon"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage >= totalPages}
                className={cn(
                  "h-8 w-8",
                  currentPage >= totalPages && "opacity-40 pointer-events-none"
                )}
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
