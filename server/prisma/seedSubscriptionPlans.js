
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultPlans = [
  {
    name: "Monthly",
    description: "Flexible monthly billing.",
    billingInterval: "month",
    amount: "5.000",
  },
  {
    name: "Yearly",
    description: "Save 10 OMR compared with monthly billing.",
    billingInterval: "year",
    amount: "50.000",
  },
];

async function main() {
  for (const plan of defaultPlans) {
    const existing = await prisma.subscriptionPlan.findFirst({
      where: {
        name: plan.name,
        billingInterval: plan.billingInterval,
      },
    });

    if (existing) {
      console.log(`${plan.name} already exists. Skipping.`);
      continue;
    }

    await prisma.subscriptionPlan.create({
      data: {
        name: plan.name,
        description: plan.description,
        billingInterval: plan.billingInterval,
        commissionRate: "0.0300",
        trialMonths: 1,
        isActive: true,
        prices: {
          create: {
            amount: plan.amount,
            currency: "OMR",
            version: 1,
          },
        },
      },
    });

    console.log(`${plan.name} plan created.`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
