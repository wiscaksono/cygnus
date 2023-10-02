import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/id_ID";
import Spinnies from "spinnies";

import { RouterInputs } from "~/utils/api";

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
      createdAt: faker.date.between({
        from: new Date("2023-01-01"),
        to: new Date("2023-10-01"),
      }),
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
    const amountOfUsers = 1000;
    const pelamars = await createPelamars(amountOfUsers);
    const MAX_POOL = 10;
    const workers = [] as (() => Promise<void>)[];

    spinnies.add("main", { text: "Processing..." });

    for (let i = 0; i < amountOfUsers; i += MAX_POOL) {
      const chunk = pelamars.slice(i, i + MAX_POOL);
      workers.push(async () => {
        const users = [];

        for (const item of chunk) {
          const headers = new Headers();
          headers.append("Authorization", "");

          const body = new FormData();
          body.append("target", item.phone);

          var requestOptions = {
            method: "POST",
            headers,
            body,
          };

          const response = await fetch(`${process.env.NEXT_PUBLIC_FONNTE_BASE_URL}/validate`, requestOptions);
          const res = (await response.json()) as { status: boolean; registered: string[]; not_registered: string[] };
          console.log(res);

          spinnies.add(`worker-${i}`, { text: `Worker ${i} - Processing...` });

          let hasWhatsapp;
          if (res.status && res.registered !== undefined) {
            hasWhatsapp = res?.registered?.includes(`62${item.phone.replace(/^0+/, "")}`);
          } else {
            hasWhatsapp = false;
          }

          const pelamar: CreatePelamarInput = {
            ...item,
            hasWhatsapp,
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
