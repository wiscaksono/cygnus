import Head from "next/head";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import { Loader } from "~/components/Loader";
import { Delete } from "~/components/tracking-pelamar/delete";
import { deepEqual } from "~/utils/deepEqual";

import type { GetServerSideProps } from "next";
import type { HadirType, TrackingPelamar } from "@prisma/client";

export default function TrackingPelamar() {
  const { data, isLoading, refetch } = api.trackingPelamar.getAll.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Cygnus - Pelamar</title>
      </Head>

      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Tracking Pelamar ({0} results)</h1>
            <p className="mt-2 text-sm text-gray-700">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi, nobis neque itaque officiis vel omnis molestiae obcaecati ea, reiciendis quae, vero libero quaerat?
              Voluptatem totam error dignissimos deserunt at animi!
            </p>
          </div>
          <div className="mt-4 flex gap-x-2 sm:ml-16 sm:mt-0 sm:flex-none"></div>
        </div>
        <div className="mt-1 flow-root sm:mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {["No.", "Name", "Interview 1", "Tgl Interview 1", "Psikotest", "Compro", "Interview 2", "OJT", "Tgl OJT", "Note"].map((item, i) => (
                        <th
                          scope="col"
                          className={`whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${item === "Invited" ? "text-center" : "text-left"}`}
                          key={i}>
                          {item}
                        </th>
                      ))}

                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.result.trackingPelamar.map((pelamar, index) => (
                      <Row pelamar={pelamar} index={index} key={pelamar.id} refetch={refetch} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Row = ({ pelamar, index, refetch }: { pelamar: TrackingPelamar; index: number; refetch: () => void }) => {
  const [values, setValues] = useState<TrackingPelamar>(pelamar);
  const [debouncedInput1, setDebouncedInput1] = useState(pelamar.interview1);
  const [debouncedInput2, setDebouncedInput2] = useState(pelamar.interview2);
  const [debouncedInput3, setDebouncedInput3] = useState(pelamar.note);

  useEffect(() => {
    if (values.interview1 !== debouncedInput1) {
      const timeoutId = setTimeout(() => {
        setValues({ ...values, interview1: debouncedInput1 });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [debouncedInput1, 1000]);

  useEffect(() => {
    if (values.interview1 !== debouncedInput2) {
      const timeoutId = setTimeout(() => {
        setValues({ ...values, interview2: debouncedInput2 });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [debouncedInput2, 1000]);

  useEffect(() => {
    if (values.interview1 !== debouncedInput3) {
      const timeoutId = setTimeout(() => {
        setValues({ ...values, note: debouncedInput3 });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [debouncedInput3, 1000]);

  const update = api.trackingPelamar.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!deepEqual(values, pelamar) || values.interview1Date !== pelamar.interview1Date) {
      void (async () => {
        await update.mutateAsync(values);
        refetch();
      })();
    }
  }, [values]);

  return (
    <tr>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{index + 1}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{pelamar.name}</td>
      <td className="w-px whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input
          type="text"
          placeholder="-"
          className="w-max border-0 p-0 text-sm focus:ring-0"
          value={debouncedInput1 || ""}
          onChange={(e) => setDebouncedInput1(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setValues({ ...values, interview1: e.currentTarget.value })}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input
          type="date"
          className="ring-red w-28 border-0 p-0 text-sm focus:ring-0"
          value={values.interview1Date?.toISOString().split("T")[0] || ""}
          onChange={(e) => {
            if (e.target.valueAsDate === null) return;
            console.log(e.target.valueAsDate);
            setValues((prevValues) => ({ ...prevValues, interview1Date: e.target.valueAsDate }));
          }}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Select
          value={values.psikotest}
          onChange={(value) => {
            setValues((prevValues) => ({ ...prevValues, psikotest: value }));
          }}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Select
          value={values.compro}
          onChange={(value) => {
            setValues({ ...values, compro: value });
          }}
        />
      </td>
      <td className="w-px whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input
          type="text"
          placeholder="-"
          className="w-max border-0 p-0 text-sm focus:ring-0"
          value={debouncedInput2 || ""}
          onChange={(e) => setDebouncedInput2(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setValues({ ...values, interview2: e.currentTarget.value })}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Select
          value={values.OJT}
          onChange={(value) => {
            setValues({ ...values, OJT: value });
          }}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input
          type="date"
          className="ring-red w-28 border-0 p-0 text-sm focus:ring-0"
          value={values.OJTDate?.toISOString().split("T")[0] || ""}
          onChange={(e) => {
            if (e.target.valueAsDate === null) return;
            console.log(e.target.valueAsDate);
            setValues((prevValues) => ({ ...prevValues, OJTDate: e.target.valueAsDate }));
          }}
        />
      </td>
      <td className="w-px whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input
          type="text"
          placeholder="-"
          className="w-max border-0 p-0 text-sm focus:ring-0"
          value={debouncedInput3 || ""}
          onChange={(e) => setDebouncedInput3(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setValues({ ...values, note: e.currentTarget.value })}
        />
      </td>
      <td className="w-px whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex items-center justify-end gap-x-2">
          <Delete pelamar={values} refetch={() => void refetch()} />
        </div>
      </td>
    </tr>
  );
};

const Select = ({ value, onChange }: { value: HadirType; onChange: (value: HadirType) => void }) => {
  return (
    <select
      className="w-24 border-0 p-0 text-sm focus:ring-0"
      value={value}
      onChange={(e) => {
        onChange(e.target.value as HadirType);
      }}>
      <option value="PENDING">Pending</option>
      <option value="HADIR">Hadir</option>
      <option value="TIDAK_HADIR">Tidak Hadir</option>
    </select>
  );
};

export const config = {
  api: {
    responseLimit: false,
  },
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
