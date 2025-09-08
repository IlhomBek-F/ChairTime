import { Check, ChevronsUpDown, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useMemo, useState } from "react";
import { Label } from "./form/label";

export type MultiSelectOption = {
  label: string;
  value: number;
  disabled?: boolean;
  description?: string;
};

export type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: number[]; 
  defaultValue?: number[];
  onChange?: (values: number[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxVisibleBadges?: number; 
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
  withSelectAll?: boolean;
  maxHeight?: number;
  label?: string;
  labelClassName?: string;
  showSelectedBar?: boolean
};

export function MultiSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  maxVisibleBadges = 3,
  className,
  popoverClassName,
  disabled,
  withSelectAll = true,
  maxHeight = 260,
  labelClassName,
  label,
  showSelectedBar
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number[]>(defaultValue ?? []);

  const selected = isControlled ? value! : internal;

  const setSelected = useCallback((vals: number[]) => {
      if (!isControlled) setInternal(vals);
      onChange?.(vals);
    },
    [isControlled, onChange]
  );

  const toggle = useCallback((v: number) => {
      const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
      setSelected(next);
    }, [selected, setSelected]);

  const clearAll = useCallback(() => setSelected([]), [setSelected]);

  const allSelectable = useMemo(() => options.filter((o) => !o.disabled).map((o) => o.value), [options]);

  const allSelected = allSelectable.length > 0 && allSelectable.every((v) => selected.includes(v));

  const selectAll = useCallback(() => {
    if (allSelected) {
      setSelected(selected.filter((v) => !allSelectable.includes(v)));
    } else {
      const merged = Array.from(new Set([...selected, ...allSelectable]));
      setSelected(merged);
    }
  }, [allSelected, allSelectable, selected, setSelected]);

  const visibleBadges = selected.slice(0, maxVisibleBadges);
  const hiddenCount = Math.max(0, selected.length - visibleBadges.length);

  const selectedOptions = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o] as const));
    return selected.map((v) => map.get(v)).filter(Boolean) as MultiSelectOption[];
  }, [selected, options]);

  return (
    <div className={cn("w-full", className)}>
    <Label className={cn("text-sm font-medium mb-1", labelClassName)}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between rounded-md h-11",
              selected.length === 0 && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Filter className="h-4 w-4 shrink-0" />
              {selected.length === 0 ? (
                <span className="truncate">{placeholder}</span>
              ) : (
                <div className="flex items-center gap-1 flex-wrap">
                  {visibleBadges.map((v) => {
                    const opt = options.find((o) => o.value === v);
                    if (!opt) return null;
                    return (
                      <Badge key={v} variant="secondary" className="rounded-xl">
                        {opt.label}
                        <button
                          type="button"
                          aria-label={`Remove ${opt.label}`}
                          className="ml-1 inline-flex"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(v);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <Badge variant="outline" className="rounded-xl">+{hiddenCount}</Badge>
                  )}
                </div>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className={cn("p-0 w-[320px]", popoverClassName)}>
          <Command loop>
            <div className="px-2 pt-2">
              <CommandInput placeholder={searchPlaceholder} className="h-9" />
            </div>
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </CommandEmpty>

              {withSelectAll && (
                <>
                  <CommandGroup heading="Selection">
                    <CommandItem
                      onSelect={selectAll}
                      className={cn("gap-2 px-3 py-2")}
                    >
                      <Checkbox checked={allSelected} className="pointer-events-none" />
                      <span>{allSelected ? "Unselect all" : "Select all"}</span>
                    </CommandItem>
                    <CommandItem onSelect={clearAll} className="gap-2 px-3 py-2">
                      <X className="h-4 w-4" />
                      <span>Clear</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              <ScrollArea style={{ maxHeight }}>
                <CommandGroup heading="Options">
                  {options.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                      <CommandItem
                        key={opt.value}
                        disabled={opt.disabled}
                        onSelect={() => !opt.disabled && toggle(opt.value)}
                        className="gap-2 px-3 py-2"
                      >
                        <Checkbox checked={isSelected} className="pointer-events-none" />
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          {opt.description && (
                            <span className="text-xs text-muted-foreground">{opt.description}</span>
                          )}
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {showSelectedBar && selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((opt) => (
            <Badge key={opt.value} variant="secondary" className="rounded-xl">
              {opt.label}
              <button
                type="button"
                aria-label={`Remove ${opt.label}`}
                className="ml-1 inline-flex"
                onClick={() => toggle(opt.value)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}