import Head from "next/head";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Pelamar } from "@prisma/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/router";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { convertDateToID } from "~/utils/convertDateToID";
import { Pagination } from "~/components/Pagination";
import { SelectPerPage } from "./components/perPage";
import { CreatePelamar } from "./components/createPelamar";
import { KirimUndangan } from "./components/kirimUndangan";
import { EditPelamar } from "./components/editPelamar";
import { SendWhatsApp } from "./components/sendWhatsapp";

import type { GetServerSideProps } from "next";

export default () => {
  const router = useRouter();
  const checkbox = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPelamar, setSelectedPelamar] = useState<Pelamar[]>([]);

  const {
    data: pelamar,
    isLoading,
    refetch,
  } = api.pelamar.getAll.useQuery({
    take: parseInt(router.query.take as string, 10) || 10,
    name: router.query.name as string,
  });

  useLayoutEffect(() => {
    if (!pelamar?.result) return;
    const isIndeterminate =
      selectedPelamar.length > 0 &&
      selectedPelamar.length < pelamar.result.pelamar.length;
    setChecked(
      selectedPelamar.length === (pelamar && pelamar.result.pelamar.length)
    );
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPelamar]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function toggleAll() {
    if (!pelamar) return;
    setSelectedPelamar(
      checked || indeterminate
        ? []
        : pelamar.result.pelamar
          .filter((p) => !p.invitedByWhatsapp)
          .filter((p) => p.hasWhatsapp)
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  if (isLoading || !pelamar) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Pelamar</title>
      </Head>

      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Pelamar
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Daftar pelamar yang telah mengisi form pendaftaran.
            </p>
          </div>
          <div className="mt-4 flex gap-x-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <KirimUndangan
              refetch={refetch}
              selectedPelamar={selectedPelamar}
            />
            <CreatePelamar refetch={refetch} />
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="mb-4 flex items-center gap-x-4">
            <div className="relative flex flex-1 items-center">
              <div className="absolute left-0 top-1/2 flex -translate-y-1/2 py-1.5 pl-1.5">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 py-1.5 pl-8 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onKeyDown={(e) => {
                  if (!e.currentTarget.value && router.query.name) {
                    router.push("/pelamar");
                  }
                  if (e.key === "Enter") {
                    router.push({
                      query: {
                        name: e.currentTarget.value,
                      },
                    });
                  }
                }}
                defaultValue={router.query.name}
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                  Ctrl + F
                </kbd>
              </div>
            </div>

            <SelectPerPage />
          </div>
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
                      {[
                        "Nama Kandidat",
                        "No. Telepon",
                        // "Email",
                        "Posisi dilamar",
                        "Tanggal Interview",
                        "Diinput",
                        "Invited",
                      ].map((item, i) => (
                        <th
                          scope="col"
                          className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          key={i}
                        >
                          {item}
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pelamar.result.pelamar.map((person, i) => (
                      <tr key={i}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedPelamar.includes(person) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            value={person.email}
                            checked={selectedPelamar.includes(person)}
                            disabled={
                              person.invitedByWhatsapp || !person.hasWhatsapp
                            }
                            onChange={(e) =>
                              setSelectedPelamar(
                                e.target.checked
                                  ? [...selectedPelamar, person]
                                  : selectedPelamar.filter((p) => p !== person)
                              )
                            }
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <p className="inline-flex items-center gap-x-2">
                            {person.phone}
                            {!person.hasWhatsapp && (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                          </p>
                        </td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> */}
                        {/*   {person.email} */}
                        {/* </td> */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.position}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(
                            person.interviewDate,
                            "hh:mm EEEE, dd MMMM yyyy",
                            {
                              locale: id,
                            }
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {convertDateToID(person.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.invitedByWhatsapp ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                        </td>

                        <td className="relative space-x-2 whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                          <SendWhatsApp refetch={refetch} person={person} />
                          <EditPelamar refetch={refetch} person={person} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination totalCount={pelamar.result.count} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
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
