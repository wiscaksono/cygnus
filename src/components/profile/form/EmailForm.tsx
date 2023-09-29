import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";

import type { IUpdateEmailTemplate } from "~/schema/emailTemplate";

export const EmailForm = () => {
  const { data, isLoading } = api.emailTemplate.get.useQuery();
  const { register, handleSubmit } = useForm<IUpdateEmailTemplate>({
    values: {
      sender: data?.result?.sender || "",
      senderEmail: data?.result?.senderEmail || "",
      subject: data?.result?.subject || "",
    },
  });

  const mutation = api.emailTemplate.update.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
    },
  });

  const onSubmit: SubmitHandler<IUpdateEmailTemplate> = async (data) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading || !data) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Email</h2>
              <p className="mb-10 mt-1 text-sm leading-6 text-gray-600">Email yang akan digunakan untuk mengirim email ke pelamar.</p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="sender" className="block text-sm font-medium leading-6 text-gray-900">
                Nama Pengirim
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="sender"
                  autoComplete="sender"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("sender", { required: true })}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="sender-email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Pengirim
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="sender-email"
                  autoComplete="sender-email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("senderEmail", { required: true })}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
                Subject
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="subject"
                  autoComplete="subject"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("subject", { required: true })}
                />
              </div>
            </div>

            <iframe src={`${env.NEXT_PUBLIC_WEBSITE_URL}/email.html`} className="col-span-full min-h-screen" width="100%" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={mutation.isLoading}>
          {mutation.isLoading ? "Saving..." : "Simpan Email Template"}
        </button>
      </div>
    </form>
  );
};
