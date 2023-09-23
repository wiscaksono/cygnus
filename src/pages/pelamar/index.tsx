import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import { convertDateToID } from "~/utils/convertDateToID";
import { CreatePelamar } from "./components/createPelamar";
import { EditPelamar } from "./components/editPelamar";

export default () => {
  const { data: pelamar, isLoading, refetch } = api.pelamar.getAll.useQuery();

  if (isLoading || !pelamar) return <div>Loading...</div>;

  return (
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
        <CreatePelamar refetch={refetch} />
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "No",
                      "Nama Kandidat",
                      "No. Telepon",
                      "Email",
                      "Posisi dilamar",
                      "Tanggal Interview",
                      "Diinput",
                      "Invited",
                    ].map((item, i) => (
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                  {pelamar.map((person, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {i + 1}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.position}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {convertDateToID(person.interviewDate, {
                          withTime: true,
                        })}
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
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <EditPelamar refetch={refetch} data={person} />
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
  );
};
