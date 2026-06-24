import { prisma } from "../../src/lib/prisma";
import { recurringService } from "../../src/services/recurringService";

async function run() {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const rows: any[] = await tx.$queryRaw`
      SELECT * FROM "RecurringTransaction"
      WHERE "active" = true AND "nextRunAt" <= ${now}
      ORDER BY "nextRunAt" ASC
      LIMIT 100
      FOR UPDATE SKIP LOCKED
    `;

    if (!rows.length) {
      console.log("No recurring transactions due");
      return;
    }

    for (const r of rows) {
      try {
        console.log("Materializing recurring", r.id);
        await recurringService.materializeOccurrence(r, tx);
      } catch (err) {
        console.error("Failed to materialize", r.id, err);
      }
    }
  });
}

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default run;
