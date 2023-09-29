import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/id_ID";
import { RouterInputs } from "~/utils/api";

type createPelamarInput = RouterInputs["pelamar"]["create"] & {
  userId: string;
  hasWhatsapp: boolean;
  createdAt: Date;
};

const prisma = new PrismaClient();

async function isPhoneUnique(phone: string) {
  const existingPelamar = await prisma.pelamar.findFirst({
    where: { phone },
  });
  return !existingPelamar;
}

async function main() {
  await prisma.pelamar.deleteMany({});

  const amountOfUsers = 200;
  const pelamars: createPelamarInput[] = [];

  for (let i = 0; i < amountOfUsers; i++) {
    let phone: string;
    do {
      const randomFourDigitNumber = Math.floor(Math.random() * 10000000);
      phone = `087885${randomFourDigitNumber.toString().padStart(6, "0")}`;
    } while (!(await isPhoneUnique(phone)));

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("token", process.env.NEXT_PUBLIC_RUANG_WHATSAPP_TOKEN!);
    urlencoded.append("number", phone);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    const response = await fetch("https://app.ruangwa.id/api/check_number", requestOptions);

    const res = await response.json();

    const { onwhatsapp } = res;

    const pelamar: createPelamarInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone,
      hasWhatsapp: onwhatsapp === "true",
      position: faker.person.jobTitle(),
      interviewDate: faker.date.future(),
      createdAt: faker.date.past(),
      userId: "cln4g5yrh0000in7m4osmoddr",
    };

    pelamars.push(pelamar);
    console.log(`Pelamar ${i + 1} berhasil dibuat`);
  }

  const addUsers = async () =>
    await prisma.pelamar.createMany({
      data: pelamars,
    });

  await addUsers();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
