"use client";

import { useClickAway } from "@/hooks/useClickAway";
import { Registered } from "@/hooks/useForm";

import { ChevronDown } from "@/assets/icons/ChevronDown";
import SearchIcon from "@/assets/icons/SearchIcon";
import { cn } from "@/utils/cn";
import { FC, ReactNode, useMemo, useRef, useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { TextField } from "./TextField";

interface IterProps<Item> {
  item: Item;
}

interface Props<Item, ID extends string = string> extends Registered<ID> {
  identifier: (p: IterProps<Item>) => ID;
  options: Item[];
  Render?: FC<IterProps<Item>>;
  className?: string;
  emptyState?: ReactNode;
  RenderSelected?: FC<IterProps<Item>>;
  variant?: 1 | 2;
  floating?: boolean;
  searchBy?: (p: IterProps<Item>, search: string) => boolean;
  renderOnlyWhenOpen?: boolean;
  absoluteDrop?: boolean;
  dropUp?: boolean;
}

export const Select = <Item, ID extends string = string>({
  value,
  onChange,
  identifier,
  options,
  Render = ({ item }) => <>{identifier({ item })}</>,
  RenderSelected,
  className,
  variant = 1,
  emptyState = <p>SELECT</p>,
  floating,
  searchBy,
  renderOnlyWhenOpen,
  absoluteDrop,
  error,
  isTouched,
  dropUp,
}: Props<Item, ID>) => {
  const selected = useMemo(
    () => options.find((item) => identifier({ item }) === value),
    [value, options]
  );
  const [search, setSearch] = useState("");
  const filteredOptions = useMemo(
    () =>
      searchBy ? options.filter((item) => searchBy({ item }, search)) : options,
    [search, options]
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    if (open) setOpen(false);
  });
  const Selected = RenderSelected ?? Render;
  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        open ? "z-20" : "",
        loading ? "cursor-progress" : "",
        className
      )}
    >
      <div onClick={() => setOpen((p) => !p)}>
        <div
          className={[
            "cursor-pointer gap-3 justify-between rounded-lg py-2 flex items-center",
            selected ? "pl-5 pr-2" : "px-2",
            variant === 1 ? "border" : "",
            loading ? "opacity-50 pointer-events-none" : "",
            error && isTouched ? "border-red-500 bg-red-50" : "",
          ].join(" ")}
        >
          {selected ? <Selected item={selected} /> : emptyState}
          {/* <div className="border-4 h-1 w-1 border-transparent border-l-black border-b-black -mt-1 mr-2 -rotate-45" /> */}
          <ChevronDown
            className={cn("mr-3 transition-all", open && "rotate-180")}
          />
        </div>
      </div>
      <div
        className={cn(
          "h-0 transition-all z-10",
          absoluteDrop ? "absolute" : "relative",
          open ? "" : "-translate-y-1 opacity-0 pointer-events-none",
          floating ? "absolute top-full left-0" : "",
          dropUp ? "absolute top-[unset] bottom-full left-0 h-[unset]" : ""
        )}
      >
        <div className="flex flex-col bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 border rounded-xl">
          {searchBy && (
            <div className="mb-2 bg-white">
              <TextField
                Icon1={<SearchIcon />}
                size={1}
                placeholder="Search"
                value={search}
                onChange={setSearch}
                autoFocus={renderOnlyWhenOpen && open}
              />
            </div>
          )}
          <div className="max-h-[200px] flex-1 overflow-y-auto">
            {(!renderOnlyWhenOpen || open) &&
              filteredOptions.map((item) => {
                const id = identifier({ item });
                return (
                  <div
                    key={id}
                    onClick={async () => {
                      setLoading(true);
                      await onChange(id);
                      setOpen(false);
                      setLoading(false);
                    }}
                    className={[
                      "p-2 cursor-pointer rounded-lg",
                      id === value
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "hover:bg-gray-50",
                      loading ? "opacity-50 pointer-events-none" : "",
                    ].join(" ")}
                  >
                    <Render item={item} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <ErrorMessage isTouched={isTouched} error={error} />
    </div>
  );
};
