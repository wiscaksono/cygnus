import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { useModal } from "~/hooks";
import { api } from "~/utils/api";

import type { ICreatePelamar } from "~/schema/pelamar";

export const CreatePelamar = ({ refetch }: { refetch: () => void }) => {
  const { openModal, isOpen, closeModal } = useModal();
  const { register, handleSubmit, reset } = useForm<ICreatePelamar>();

  const cancelButtonRef = useRef(null);

  const mutation = api.pelamar.create.useMutation({
    onSuccess: ({ message, status }) => {
      if (status !== 201) return toast.error(message);
      refetch();
      closeModal();
      reset();
      toast.success(message);
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<ICreatePelamar> = async (data) => {
    await mutation.mutateAsync(data);
  };

  return (
    <>
      <button
        type="button"
        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={openModal}>
        Tambah Pelamar
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
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Tambah Pelamar
                      </Dialog.Title>
                      <form className="mt-2 grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
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
                        <div className="col-span-2">
                          <label htmlFor="portal" className="block text-sm font-medium leading-6 text-gray-900">
                            Portal
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="portal"
                              autoComplete="portal-name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              {...register("portal", { required: true })}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                          <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
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
                          <label htmlFor="position" className="block text-sm font-medium leading-6 text-gray-900">
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
                          <label htmlFor="interview-date" className="block text-sm font-medium leading-6 text-gray-900">
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
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 sm:ml-3"
                      onClick={() => void handleSubmit(onSubmit)()}
                      disabled={mutation.isLoading}>
                      {mutation.isLoading ? "Loading..." : "Tambah"}
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
