import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/id_ID";
import { RouterInputs } from "~/utils/api";
import Spinnies from "spinnies";

type CreatePelamarInput = RouterInputs["pelamar"]["create"] & {
  createdAt: Date;
  userId: string;
};

const prisma = new PrismaClient();

const pelamars: CreatePelamarInput[] = [];

async function isPhoneUnique(phone: string) {
  const existingPelamar = pelamars.find((pelamar) => pelamar.phone === phone);
  return !existingPelamar;
}

async function generateUniquePhone() {
  let phone: string;
  const temp = "087xxxxxxxxx";

  do {
    phone = temp
      .split("")
      .map((char) => (char === "x" ? Math.floor(Math.random() * 10).toString() : char))
      .join("");
  } while (!isPhoneUnique(phone));

  return phone;
}

async function createPelamars(amount: number) {
  for (let i = 0; i < amount; i++) {
    const phone = await generateUniquePhone();
    const pelamar: CreatePelamarInput = {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      position: faker.person.jobTitle(),
      interviewDate: faker.date.future(),
      createdAt: faker.date.past(),
      userId: "cln6ls2c00000sbkc5evjv39h",
      portal: faker.internet.domainWord(),
      phone,
      hasWhatsapp: true,
    };
    pelamars.push(pelamar);
  }
  return pelamars;
}

(async () => {
  const spinnies = new Spinnies();
  try {
    await prisma.pelamar.deleteMany({});
    const amountOfUsers = 100;
    const pelamars = await createPelamars(amountOfUsers);
    const MAX_POOL = 10;
    const workers = [] as (() => Promise<void>)[];

    spinnies.add("main", { text: "Processing..." });

    for (let i = 0; i < amountOfUsers; i += MAX_POOL) {
      const chunk = pelamars.slice(i, i + MAX_POOL);
      workers.push(async () => {
        const users = [];

        for (const item of chunk) {
          // var myHeaders = new Headers();
          // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

          // var urlencoded = new URLSearchParams();
          // urlencoded.append("token", process.env.NEXT_PUBLIC_RUANG_WHATSAPP_TOKEN!);
          // urlencoded.append("number", item.phone);

          // var requestOptions = {
          //   method: "POST",
          //   headers: myHeaders,
          //   body: urlencoded,
          // };

          spinnies.add(`worker-${i}`, { text: `Worker ${i} - Processing...` });
          // const response = await fetch("https://app.ruangwa.id/api/check_number", requestOptions);
          // const res = await response.json();
          // const { onwhatsapp } = res;

          const pelamar: CreatePelamarInput = {
            ...item,
            hasWhatsapp: true,
          };
          users.push(pelamar);
        }

        await prisma.pelamar.createMany({
          data: users,
        });

        // Remove the worker spinner when done
        spinnies.succeed(`worker-${i}`, { text: `Worker ${i} - Done` });
      });
    }

    await Promise.all(workers.map((worker) => worker()));
    spinnies.succeed("main", { text: "Done" });
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    spinnies.fail("main", { text: "Error" });
    await prisma.$disconnect();
    process.exit(1);
  }
})();
