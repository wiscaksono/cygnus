import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { Loader } from "~/components/Loader";

import type { IUpdateSelf } from "~/schema/user";

export const ProfileForm = () => {
  const { data, isLoading } = api.user.getSelf.useQuery();
  const { register, handleSubmit } = useForm<IUpdateSelf>({
    values: {
      fullName: data?.fullName,
      email: data?.email,
      templateWhatsApp: data?.templateWhatsApp || "",
      phone: data?.phone,
      whatsAppToken: data?.whatsAppToken || undefined,
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
                <span className="text-gray-400">&#123;&#123;interviewTime&#125;&#125;</span>{" "}
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
          disabled={mutation.isLoading}>
          {mutation.isLoading ? "Saving..." : "Simpan Profile"}
        </button>
      </div>
    </form>
  );
};
