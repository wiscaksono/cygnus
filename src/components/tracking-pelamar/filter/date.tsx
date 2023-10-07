import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

dayjs.extend(utc);
dayjs.extend(timezone);

import type { FilterTrackingPelamarProps } from "~/pages/tracking-pelamar";

export const DateFilter = ({ filter, setFilter }: FilterTrackingPelamarProps) => {
  return (
    <div className="flex w-full items-center justify-between rounded-md border border-gray-300 shadow-sm md:w-auto md:justify-center">
      <button
        className="border-r px-1.5 py-[7px] text-gray-400 ring-0 hover:text-gray-900 focus:outline-none focus:ring-0"
        onClick={() => {
          setFilter({
            ...filter,
            createdAt: dayjs(filter.createdAt).subtract(1, "day").toDate(),
          });
        }}>
        <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>
      <input
        type="date"
        className="w-36 border-0 py-0 text-xs text-gray-900 ring-0 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
        value={filter.createdAt ? dayjs(filter.createdAt).tz("Asia/Jakarta").format("YYYY-MM-DD") : ""}
        onChange={(e) => {
          setFilter({
            ...filter,
            createdAt: e.target.value ? dayjs(e.target.value).tz("Asia/Jakarta").toDate() : undefined,
          });
          console.log(e.target.value);
        }}
      />
      <button
        className="border-l px-1.5 py-[7px] text-gray-400 ring-0 hover:text-gray-900 focus:outline-none focus:ring-0"
        onClick={() => {
          setFilter({
            ...filter,
            createdAt: dayjs(filter.createdAt).add(1, "day").toDate(),
          });
        }}>
        <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>
    </div>
  );
};
