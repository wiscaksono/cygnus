import Head from "next/head";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";

import type { GetServerSideProps } from "next";
import type { IUpdateSelf } from "~/schema/user";

export default function Profile() {
  const { data, isLoading } = api.user.getSelf.useQuery();
  const { register, handleSubmit } = useForm<IUpdateSelf>({
    values: {
      username: data?.username,
      email: data?.email,
      templateWhatsApp: data?.templateWhatsApp || "",
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

  if (isLoading || !data) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="username"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("username", { required: true })}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
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

              <div className="col-span-full">
                <label
                  htmlFor="template"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Template WhatsApp
                </label>
                <textarea
                  id="template"
                  rows={15}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("templateWhatsApp", { required: true })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
