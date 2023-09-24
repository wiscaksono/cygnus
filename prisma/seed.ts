import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/id_ID";
import { RouterInputs } from "~/utils/api";

type createPelamarInput = RouterInputs["pelamar"]["create"] & {
  userId: string;
};

const prisma = new PrismaClient();

async function main() {
  await prisma.pelamar.deleteMany({});

  const amountOfUsers = 10;
  const pelamars: createPelamarInput[] = [];

  for (let i = 0; i < amountOfUsers; i++) {
    const pelamar: createPelamarInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      position: faker.person.jobTitle(),
      interviewDate: faker.date.future(),
      userId: "clmxmmc3f0000in9gsok7j1dr",
    };

    pelamars.push(pelamar);
  }
  const addUsers = async () =>
    await prisma.pelamar.createMany({
      data: pelamars,
    });

  addUsers();
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
