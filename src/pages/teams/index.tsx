import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";

export default function Teams() {
  const { data: teams, isLoading } = api.team.getAll.useQuery();

  if (!teams || isLoading) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Teams</title>
      </Head>
      <ul
        role="list"
        className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        {teams.map((team) => (
          <li key={team.id}>
            <Image
              width={300}
              height={200}
              className="aspect-[3/2] w-full rounded-2xl object-cover"
              src={team.image}
              alt={team.username}
            />
            <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
              {team.username}
            </h3>
            <p className="text-base leading-7 text-gray-600">{team.email}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
