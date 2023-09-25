import Link from "next/link";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const data = [10, 20, 30, 40, 50, 100];

export const SelectPerPage = () => {
  const router = useRouter();

  return (
    <Listbox value={router.query.take || data[0]} onChange={() => { }}>
      <div className="relative">
        <Listbox.Button className="relative block w-full rounded-md border-0 py-1.5 pl-2.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{router.query.take || data[0]}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {data.map((item) => (
              <Listbox.Option
                as={Link}
                href={`?take=${item}`}
                key={item}
                className={({ active }) =>
                  `relative block cursor-default select-none px-4 py-2 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? "font-medium" : "font-normal"
                        }`}
                    >
                      {item}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
