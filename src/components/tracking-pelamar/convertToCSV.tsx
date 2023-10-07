import { useState, useEffect } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id-ID");

import type { TrackingPelamar } from "@prisma/client";

export const ConvertToCSV = ({ pelamar }: { pelamar: TrackingPelamar[] }) => {
  const [csvData, setCsvData] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const convertToCsv = () => {
    setIsConverting(true);

    try {
      const csvHeader = "No.,Nama Kandidat,Tgl Interview 1,Interview 1,Psikotest,Compro,Interview 2,Tgl OJT,Hadir OJT,Note\n";
      let csvContent = csvHeader;

      for (let index = 0; index < pelamar.length; index++) {
        const item = pelamar[index];
        const row = [
          index + 1,
          item?.name ?? "",
          dayjs(item?.interview1Date).isValid() ? dayjs(item?.interview1Date).tz("Asia/Jakarta").format("DD-MM-YYYY") ?? "" : "",
          item?.interview1 ?? "",
          item?.psikotest ?? "",
          item?.compro ?? "",
          item?.interview2 ?? "",
          dayjs(item?.OJTDate).isValid() ? dayjs(item?.OJTDate).tz("Asia/Jakarta").format("DD-MM-YYYY") ?? "" : "",
          item?.OJT ?? "",
          item?.note ?? "",
        ];
        csvContent += row.join(",") + "\n";
      }

      setCsvData(csvContent);
    } catch (error) {
      toast.error("An error occurred during conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadCSV = () => {
    if (csvData) {
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV berhasil didownload");
      setCsvData("");
    }
  };

  useEffect(() => {
    if (csvData) {
      downloadCSV();
    }
  }, [csvData]);

  return (
    <button
      type="button"
      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
      disabled={isConverting}
      onClick={() => {
        convertToCsv();
      }}
    >
      {isConverting ? "Converting..." : "Convert to CSV"}
    </button>
  );
};
