import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Pelamar } from "@prisma/client";
import { PencilIcon } from "@heroicons/react/24/outline";

import { useModal } from "~/hooks";
import { api } from "~/utils/api";

import type { IDeletePelamar, IUpdatePelamar } from "~/schema/pelamar";

interface IEditPelamar {
  refetch: () => void;
  person: Pelamar;
}

export const EditPelamar = ({ refetch, person }: IEditPelamar) => {
  const cancelButtonRef = useRef(null);
  const { openModal, isOpen, closeModal } = useModal();
  const { register, handleSubmit } = useForm<IUpdatePelamar>({
    values: {
      id: person.id,
      name: person.name,
      email: person.email,
      phone: person.phone,
      position: person.position,
      interviewDate: convertToDateTimeLocalString(person.interviewDate),
    },
  });

  const mutation = api.pelamar.update.useMutation({
    onSuccess: ({ message, status }) => {
      if (status !== 201) return toast.error(message);
      refetch();
      closeModal();
      toast.success(message);
    },
  });

  const onSubmit: SubmitHandler<IUpdatePelamar> = async (data) => {
    await mutation.mutateAsync(data);
  };

  const deleteMutation = api.pelamar.delete.useMutation({
    onSuccess: ({ message }) => {
      refetch();
      closeModal();
      toast.success(message);
    },
  });

  const onDelete = async (data: IDeletePelamar) => {
    await deleteMutation.mutateAsync(data);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="inline text-indigo-600 hover:text-indigo-900"
      >
        <PencilIcon className="h-6 w-6" />
      </button>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[60]"
          initialFocus={cancelButtonRef}
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
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
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Ubah Pelamar
                      </Dialog.Title>
                      <form className="mt-2 grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Nama
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="name"
                              autoComplete="given-name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              {...register("name", { required: true })}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email
                          </label>
                          <div className="mt-2">
                            <input
                              type="email"
                              id="email"
                              autoComplete="email"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              {...register("email", { required: true })}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            No. Telepon
                          </label>
                          <div className="mt-2">
                            <input
                              type="number"
                              id="phone"
                              autoComplete="phone"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              {...register("phone", { required: true })}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="position"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Posisi Dilamar
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="position"
                              autoComplete="position"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              {...register("position", { required: true })}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="interview-date"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Tanggal Interview
                          </label>
                          <div className="mt-2">
                            <input
                              type="datetime-local"
                              id="interview-date"
                              autoComplete="interview-date"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              {...register("interviewDate", {
                                required: true,
                                valueAsDate: true,
                              })}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => onDelete(person)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-500 hover:text-white hover:ring-red-500 sm:ml-3 sm:mt-0 sm:w-auto"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeModal}
                      ref={cancelButtonRef}
                    >
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

const convertToDateTimeLocalString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
