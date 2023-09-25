import { useRef, useState, useEffect } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import type { FilterProps } from "~/pages/pelamar";

export const SearchBar = ({ filter, setFilter }: FilterProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedInput, setDebouncedInput] = useState(filter.name);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter({ ...filter, name: debouncedInput });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [debouncedInput, 500]);

  return (
    <div className="relative flex flex-1 items-center">
      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 py-1.5 pl-1.5">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        name="search"
        id="search"
        className="block w-full rounded-md border-0 py-1.5 pl-8 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={debouncedInput}
        onChange={(e) => setDebouncedInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          setFilter({ ...filter, name: e.currentTarget.value })
        }
      />
      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
        <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
          Ctrl + F
        </kbd>
      </div>
    </div>
  );
};
