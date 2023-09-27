import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { useCSVReader, formatFileSize } from "react-papaparse";

import { useModal } from "~/hooks";
import { api } from "~/utils/api";

export const ImportFromCSV = ({ refetch }: { refetch: () => void }) => {
  const cancelButtonRef = useRef(null);
  const { openModal, isOpen, closeModal } = useModal();
  const { CSVReader } = useCSVReader();

  const [file, setFile] = useState<Array<string>>([]);

  const mutation = api.pelamar.create.useMutation({});

  const handleSubmit = async () => {
    try {
      for (const data of file) {
        const name = data[1] as string;
        const phone = `0${data[2]?.replace(/\D/g, "")}` as string;
        const email = data[3] as string;
        const position = data[5] as string;
        const interviewDate = new Date(Date.parse(data[7] as string)) as Date;

        await mutation
          .mutateAsync({
            name,
            phone,
            email,
            position,
            interviewDate,
          })
          .catch((error) => {
            throw error;
          });
      }

      refetch();
      closeModal();
      toast.success("Berhasil menambahkan pelamar");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menambahkan pelamar");
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
                      <CSVReader
                        onUploadAccepted={(results: any) => {
                          setFile(results.data.slice(1));
                        }}>
                        {({ getRootProps, acceptedFile, ProgressBar }: any) => (
                          <div {...getRootProps()} className="flex h-60 w-full items-center justify-center rounded-lg border border-dashed">
                            {acceptedFile ? (
                              <>
                                <div>
                                  <div className="flex flex-col items-center justify-center">
                                    <span>
                                      {acceptedFile.name} ({formatFileSize(acceptedFile.size)})
                                    </span>
                                  </div>
                                  <ProgressBar />
                                </div>
                              </>
                            ) : (
                              "Drop CSV file here or click to upload"
                            )}
                          </div>
                        )}
                      </CSVReader>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 sm:ml-3"
                      onClick={handleSubmit}
                      disabled={mutation.isLoading || !file.length}>
                      Tambah
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
