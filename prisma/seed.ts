import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

(async () => {
  await prisma.pelamar.deleteMany();
  for (let i = 0; i < 100; i++) {
    try {
      await prisma.pelamar.create({
        data: {
          name: `Pelamar ${i}`,
          email: `pelamar${i}@gmail.com`,
          phone: `08123456789${i}`,
          position: `Position ${i}`,
          userId: "clmw0nxm40000inxavyn8ktw7",
          interviewDate: new Date(),
        },
      });
    } catch (error) {
      await prisma.$disconnect();
    } finally {
      await prisma.$disconnect();
    }
  }
})();
