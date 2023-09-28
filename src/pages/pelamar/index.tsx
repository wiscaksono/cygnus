import Head from "next/head";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { CheckCircleIcon, XMarkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import { convertDateToID } from "~/utils/convertDateToID";
import { getServerAuthSession } from "~/server/auth";

import { SearchBar, SelectPerPage } from "~/components/pelamar/filter";
import { CreatePelamar } from "~/components/pelamar/createPelamar";
import { ImportFromCSV } from "~/components/pelamar/importFromCSV";
import { EditPelamar } from "~/components/pelamar/editPelamar";
import { SendWhatsApp } from "~/components/pelamar/sendWhatsApp";
import { SendWhatsAppAll } from "~/components/pelamar/sendWhatsAppAll";
import { SendEmail } from "~/components/pelamar/sendEmail";
import { SendEmailAll } from "~/components/pelamar/sendEmailAll";
import { DeleteAll } from "~/components/pelamar/deleteAll";
import { WhatsAppIcon } from "~/components/Icons";

import type { Pelamar } from "@prisma/client";
import type { GetServerSideProps } from "next";
import type { Dispatch, SetStateAction } from "react";

export interface FilterProps {
  filter: {
    name?: string;
    take?: number;
    skip?: number;
    hasWhatsapp?: boolean;
    invitedByWhatsapp?: boolean;
    invitedByEmail?: boolean;
  };
  setFilter: Dispatch<
    SetStateAction<{
      name?: string;
      take?: number;
      skip?: number;
      hasWhatsapp?: boolean;
      invitedByWhatsapp?: boolean;
      invitedByEmail?: boolean;
    }>
  >;
}

export default function Pelamar() {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPelamar, setSelectedPelamar] = useState<Pelamar[]>([]);
  const [filter, setFilter] = useState<FilterProps["filter"]>({
    name: "",
    take: 10,
    skip: 0,
  });

  const { data: pelamar, isLoading, refetch } = api.pelamar.getAll.useQuery(filter);

  useLayoutEffect(() => {
    if (!pelamar?.result) return;
    const isIndeterminate = selectedPelamar.length > 0 && selectedPelamar.length < pelamar.result.pelamar.length;
    setChecked(selectedPelamar.length === (pelamar && pelamar.result.pelamar.length));
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPelamar]);

  function toggleAll() {
    if (!pelamar) return;
    setSelectedPelamar(checked || indeterminate ? [] : pelamar.result.pelamar.filter((person) => person.hasWhatsapp));
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  useEffect(() => {
    void refetch();
  }, [filter]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Pelamar</title>
      </Head>

      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Pelamar</h1>
            <p className="mt-2 text-sm text-gray-700">Daftar pelamar yang telah mengisi form pendaftaran.</p>
          </div>
          <div className="mt-4 flex gap-x-2 sm:ml-16 sm:mt-0 sm:flex-none">
            <DeleteAll refetch={() => void refetch()} selectedPelamar={selectedPelamar} />
            <SendEmailAll refetch={() => void refetch()} selectedPelamar={selectedPelamar} />
            <SendWhatsAppAll refetch={() => void refetch()} selectedPelamar={selectedPelamar} />
            <ImportFromCSV refetch={() => void refetch()} />
            <CreatePelamar refetch={() => void refetch()} />
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="mb-4 flex items-center gap-x-2">
            <SearchBar filter={filter} setFilter={setFilter} />
            <button
              onClick={() => {
                setFilter({
                  ...filter,
                  invitedByEmail: !filter.invitedByEmail,
                });
              }}
              className={`block ${filter.invitedByEmail ? "bg-indigo-600 text-white" : "text-gray-800"
                } rounded-md border-0 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}>
              Invited by Email
            </button>
            <button
              onClick={() => {
                setFilter({
                  ...filter,
                  invitedByWhatsapp: !filter.invitedByWhatsapp,
                });
              }}
              className={`block ${filter.invitedByWhatsapp ? "bg-indigo-600 text-white" : "text-gray-800"
                } rounded-md border-0 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}>
              Invited by WhatsApp
            </button>
            <button
              onClick={() => {
                setFilter({
                  ...filter,
                  hasWhatsapp: !filter.hasWhatsapp,
                });
              }}
              className={`block ${filter.hasWhatsapp ? "bg-indigo-600 text-white" : "text-gray-800"
                } rounded-md border-0 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}>
              Have WhatsApp
            </button>
            <SelectPerPage filter={filter} setFilter={setFilter} />
          </div>
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
                      {["No.", "Nama Kandidat", "No. Telepon", "Email", "Posisi dilamar", "Tanggal Interview", "Invited"].map((item, i) => (
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
                    {pelamar?.result.pelamar.map((person, i) => (
                      <tr key={i}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedPelamar.includes(person) && <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            value={person.email}
                            checked={selectedPelamar.includes(person)}
                            onChange={(e) => setSelectedPelamar(e.target.checked ? [...selectedPelamar, person] : selectedPelamar.filter((p) => p !== person))}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{i + 1}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <p className="inline-flex items-center gap-x-2">
                            {person.phone}
                            {!person.hasWhatsapp && <XMarkIcon className="h-5 w-5 text-red-500" />}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.position}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{convertDateToID(person.createdAt)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center justify-center gap-x-2">
                            <span className="flex shrink-0 items-center gap-x-1">
                              <WhatsAppIcon size={20} /> :{" "}
                              {person.invitedByWhatsapp ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <XMarkIcon className="h-5 w-5 text-red-500" />}
                            </span>
                            <span className="flex shrink-0 items-center gap-x-1">
                              <EnvelopeIcon className="h-6 w-6" /> :{" "}
                              {person.invitedByEmail ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <XMarkIcon className="h-5 w-5 text-red-500" />}
                            </span>
                          </div>
                        </td>

                        <td className="relative py-4 pl-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-x-2">
                            <SendEmail refetch={() => void refetch()} person={person} />
                            <SendWhatsApp refetch={() => void refetch()} person={person} />
                            <EditPelamar refetch={() => void refetch()} person={person} />
                          </div>
                        </td>
                      </tr>
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
