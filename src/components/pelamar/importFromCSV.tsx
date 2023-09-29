import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";

import { useModal } from "~/hooks";
import { api } from "~/utils/api";
import whatsApp from "~/server/whatsApp";

import type { RouterInputs } from "~/utils/api";

export const ImportFromCSV = ({ refetch }: { refetch: () => void }) => {
  const cancelButtonRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal, isOpen, closeModal } = useModal();

  const [file, setFile] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = api.pelamar.createMany.useMutation();

  const handleSubmit = () => {
    const reader = new FileReader();

    try {
      setIsLoading(true);
      reader.onload = async (e) => {
        const text = e.target?.result as string;

        if (text) {
          const candidates = parseData(text);

          const hasWhatsApp = [] as Promise<{ onwhatsapp: "true" | "false" }>[];
          const mutationData = [] as RouterInputs["pelamar"]["createMany"];

          for (const candidate of candidates) {
            hasWhatsApp.push(whatsApp.checkNumber(candidate.phone) as Promise<{ onwhatsapp: "true" | "false" }>);
            mutationData.push({
              name: candidate.name,
              phone: candidate.phone,
              email: candidate.email,
              portal: candidate.portal,
              position: candidate.position,
              interviewDate: candidate.interviewDate,
            });
          }

          await Promise.all(hasWhatsApp).then((res) => {
            res.forEach((data, index) => {
              mutationData[index]!.hasWhatsapp = data.onwhatsapp === "true";
            });
          });

          await mutation.mutateAsync(mutationData).then(() => {
            toast.success("Pelamar berhasil ditambahkan");
            closeModal();
            refetch();
          });
        }
      };

      reader.readAsText(file!);
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Pelamar berhasil ditambahkan");
      refetch();
      closeModal();
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={openModal}>
        Import from CSV
      </button>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" initialFocus={cancelButtonRef} onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <div className="flex h-60 items-center justify-center rounded-lg border border-dashed bg-gray-50">
                        {file ? (
                          <div className="flex flex-col items-center justify-center">
                            <h1 className="text-xl font-semibold">File selected</h1>
                            <p className="text-sm text-gray-500">{file.name}</p>
                            <button className="mt-1 rounded-lg border bg-gray-100 px-3 py-2 text-sm" onClick={() => setFile(undefined)}>
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button className="rounded-lg border bg-gray-100 px-3 py-2 text-sm" onClick={() => inputRef.current?.click()}>
                            Select CSV file
                          </button>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          ref={inputRef}
                          accept=".csv"
                          onChange={(e) => {
                            if (e.target.files) {
                              setFile(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 sm:ml-3"
                      onClick={handleSubmit}
                      disabled={isLoading || !file}>
                      {isLoading ? "Loading..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeModal}
                      ref={cancelButtonRef}>
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

class Candidate {
  name: string;
  phone: string;
  email: string;
  portal: string;
  position: string;
  interviewDate: Date;

  constructor(name: string, phone: string, email: string, portal: string, position: string, interviewDateTimeString: string) {
    this.name = name;
    this.phone = phone.replaceAll("-", "");
    this.email = email;
    this.portal = portal;
    this.position = position;

    // Split the string by ',' to separate time and date
    const parts = interviewDateTimeString.replace(/ /g, "").split(",");

    // Extract time and date parts
    const timePart = parts[0] || ""; // "08:30"
    const datePart = parts[1] || ""; // "02-10-2023"

    // Split the time part by ':' to get hours and minutes
    const timeParts = timePart.split(":") as [string, string];
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Split the date part by '-' to get day, month, and year
    const dateParts = datePart.split("-") as [string, string, string];
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    // Create a Date object
    const date = new Date(year, month, day, hours, minutes);

    this.interviewDate = date;
  }
}

function parseData(data: string): Candidate[] {
  const lines = data.split("\n");
  const candidates: Candidate[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i]!.split(",");
    if (parts.length === 8) {
      const [_, nama, no_telp, email, portal, posisi, jam_interview, tanggal_interview] = parts;
      if (nama && no_telp && email && portal && posisi && jam_interview && tanggal_interview) {
        const candidate = new Candidate(nama, no_telp, email, portal, posisi, `${jam_interview},${tanggal_interview}`);
        candidates.push(candidate);
      }
    }
  }

  return candidates;
}
