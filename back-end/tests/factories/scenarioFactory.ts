import { prisma } from "../../src/database";

async function deleteAllData() {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
}

const scenarioFactory = {
  deleteAllData,
};

export default scenarioFactory;
