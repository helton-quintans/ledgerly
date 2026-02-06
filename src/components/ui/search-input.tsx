import { Search } from "lucide-react";
import { Input } from "./input";
import { cn } from "@ledgerly/utils";
import { forwardRef } from "react";

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <Input
          ref={ref}
          className={cn("pl-9", className)}
          {...props}
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
          style={{ color: "var(--input-placeholder)" }}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";