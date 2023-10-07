import { Fragment, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { QrCodeIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";

import { api } from "~/utils/api";
import { Loader } from "~/components/Loader";
import { useModal } from "~/hooks";

import type { IUpdateSelf } from "~/schema/user";
import type { IGetDevice } from "~/types/whatsApp";

export const ProfileForm = () => {
  const { data, isLoading, refetch } = api.user.getSelf.useQuery();
  const { register, handleSubmit } = useForm<IUpdateSelf>({
    values: {
      fullName: data?.result.fullName,
      email: data?.result.email,
      templateWhatsApp: data?.result.templateWhatsApp || "",
      phone: data?.result.phone,
      whatsAppToken: data?.result.whatsAppToken || undefined,
    },
  });

  const mutation = api.user.updateSelf.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
    },
  });

  const onSubmit: SubmitHandler<IUpdateSelf> = async (data) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) return <Loader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
      <div className="space-y-12">
        <div className="pb-5">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="full-name"
                  autoComplete="full-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("fullName", { required: true })}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
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

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                WhatsApp
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

            <div className="sm:col-span-3">
              <label htmlFor="whatsapp-token" className="block text-sm font-medium leading-6 text-gray-900">
                WhatsApp Token
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  id="whatsapp-token"
                  autoComplete="whatsapp-token"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("whatsAppToken", { required: true })}
                />
              </div>
            </div>

            <WhatsAppStatus whatsAppDevice={data?.result.whatsAppDevice} refetch={refetch} />

            <div className="col-span-full">
              <label htmlFor="template" className="block text-sm font-medium leading-6 text-gray-900">
                Template WhatsApp
              </label>
              <textarea
                id="template"
                rows={15}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("templateWhatsApp", { required: true })}
              />
              <p className="mt-1 text-sm">
                <span className="text-gray-500">Available variables: </span>
                <span className="text-gray-400">&#123;&#123;namaPelamar&#125;&#125;</span> <span className="text-gray-400">&#123;&#123;namaPengirim&#125;&#125;</span>{" "}
                <span className="text-gray-400">&#123;&#123;position&#125;&#125;</span> <span className="text-gray-400">&#123;&#123;interviewDate&#125;&#125;</span>{" "}
                <span className="text-gray-400">&#123;&#123;portal&#125;&#125;</span> <span className="text-gray-400">&#123;&#123;interviewTime&#125;&#125;</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Saving..." : "Simpan Profile"}
        </button>
      </div>
    </form>
  );
};

const WhatsAppStatus = ({ whatsAppDevice, refetch }: { whatsAppDevice: IGetDevice | undefined; refetch: () => void }) => {
  return (
    <div className="sm:col-span-full">
      <p className="block text-sm font-medium leading-6 text-gray-900">WhatsApp Status</p>
      <div className="mt-2 flex flex-col items-center justify-between gap-2 rounded-md p-2 shadow-sm ring-1 ring-inset ring-gray-300 sm:flex-row">
        <div className="flex w-full flex-col items-center gap-x-2 gap-y-1 divide-y sm:flex-row sm:divide-x sm:divide-y-0">
          <p
            className={`w-full rounded-md px-2 py-0.5 text-center text-sm font-medium capitalize sm:w-auto sm:text-left ${
              whatsAppDevice?.device_status === "connect" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
            }`}
          >
            {whatsAppDevice?.device_status}
          </p>
          <p className="w-full text-center text-sm leading-6 text-gray-600 sm:w-auto sm:pl-2 sm:text-left">
            Message sent: <b>{whatsAppDevice?.messages}</b>
          </p>
          <p className="w-full text-center text-sm leading-6 text-gray-600 sm:w-auto sm:pl-2 sm:text-left">
            Quota : <b>{whatsAppDevice?.quota}</b> <span className="text-gray-400">/ 9999</span>
          </p>
          <p className="w-full text-center text-sm leading-6 text-gray-600 sm:w-auto sm:pl-2 sm:text-left">
            Expired : <b>{whatsAppDevice?.expired}</b>
          </p>
        </div>
        <div>{whatsAppDevice?.device_status === "connect" ? <DisconnectWhatsApp refetch={refetch} /> : <ConnectWhatsApp />}</div>
      </div>
    </div>
  );
};

const DisconnectWhatsApp = ({ refetch }: { refetch: () => void }) => {
  const mutation = api.user.disconnectWhatsApp.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      refetch();
    },
  });

  const onClick = async () => {
    await mutation.mutateAsync();
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center gap-x-1 rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      <ArrowLeftOnRectangleIcon className="h-4 w-4" />
      {mutation.isLoading ? "Disconnecting..." : "Disconnect"}
    </button>
  );
};

const ConnectWhatsApp = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const { data } = api.user.getWhatsAppQR.useQuery();
  const { data: user, refetch } = api.user.getSelf.useQuery();

  useEffect(() => {
    const shouldRefetchData = () => {
      const deviceStatus = user?.result.whatsAppDevice.device_status;
      return deviceStatus === "disconnect";
    };

    const fetchData = () => {
      if (shouldRefetchData()) {
        void refetch();
      } else {
        closeModal();
      }
    };

    const intervalId = setInterval(fetchData, 4000);

    return () => clearInterval(intervalId);
  }, [user?.result.whatsAppDevice.device_status]);

  return (
    <>
      <button
        onClick={openModal}
        type="button"
        className="flex items-center gap-x-1 rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        <QrCodeIcon className="h-4 w-4" />
        Connect
      </button>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
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
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <div className="flex aspect-square h-[528px] w-[528px]  items-center justify-center rounded-lg border border-dashed bg-gray-50">
                        <Image src={`data:image/png;base64,${data?.result.url || ""}`} width={528} height={528} alt="QR Code" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeModal}
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
