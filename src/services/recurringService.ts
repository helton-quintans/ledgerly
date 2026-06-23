import { prisma } from "../lib/prisma";

export const recurringService = {
  async createRecurring(data: any, userId: string) {
    // Normalize amount sign according to `type` if provided
    const payload = { ...data, userId };
    if (payload.type && typeof payload.amount === "number") {
      payload.amount =
        payload.type === "expense"
          ? -Math.abs(payload.amount)
          : Math.abs(payload.amount);
    }
    // Prisma model doesn't have `type` field — derive it from `amount` instead
    const { type: _type, ...prismaPayload } = payload;
    // Convert date-like fields if provided as strings
    if (
      prismaPayload.startDate &&
      typeof prismaPayload.startDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(prismaPayload.startDate)
    ) {
      const [y, m, d] = prismaPayload.startDate.split("-").map(Number);
      prismaPayload.startDate = new Date(y, m - 1, d);
    }
    if (
      prismaPayload.endDate &&
      typeof prismaPayload.endDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(prismaPayload.endDate)
    ) {
      const [y, m, d] = prismaPayload.endDate.split("-").map(Number);
      prismaPayload.endDate = new Date(y, m - 1, d);
    }
    if (
      prismaPayload.nextRunAt &&
      typeof prismaPayload.nextRunAt === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(prismaPayload.nextRunAt)
    ) {
      const [y, m, d] = prismaPayload.nextRunAt.split("-").map(Number);
      prismaPayload.nextRunAt = new Date(y, m - 1, d);
    }

    const created = await prisma.recurringTransaction.create({
      data: prismaPayload,
    });
    return {
      ...created,
      amount_cents: Math.round((created.amount ?? 0) * 100),
      type: (created.amount ?? 0) >= 0 ? "income" : "expense",
    };
  },

  async updateRecurring(input: any, userId: string) {
    const { id, ...rest } = input;
    const existing = await prisma.recurringTransaction.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== userId)
      throw new Error("Not found or not owner");
    // If caller provided `type`, normalize amount sign
    const updateData = { ...rest };
    if (updateData.type && typeof updateData.amount === "number") {
      updateData.amount =
        updateData.type === "expense"
          ? -Math.abs(updateData.amount)
          : Math.abs(updateData.amount);
    }
    // Strip `type` before sending to Prisma
    const { type: _t, ...prismaUpdate } = updateData;
    // Normalize date strings
    if (
      prismaUpdate.startDate &&
      typeof prismaUpdate.startDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(prismaUpdate.startDate)
    ) {
      const [y, m, d] = prismaUpdate.startDate.split("-").map(Number);
      prismaUpdate.startDate = new Date(y, m - 1, d);
    }
    if (
      prismaUpdate.endDate &&
      typeof prismaUpdate.endDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(prismaUpdate.endDate)
    ) {
      const [y, m, d] = prismaUpdate.endDate.split("-").map(Number);
      prismaUpdate.endDate = new Date(y, m - 1, d);
    }
    if (
      prismaUpdate.nextRunAt &&
      typeof prismaUpdate.nextRunAt === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(prismaUpdate.nextRunAt)
    ) {
      const [y, m, d] = prismaUpdate.nextRunAt.split("-").map(Number);
      prismaUpdate.nextRunAt = new Date(y, m - 1, d);
    }

    const updated = await prisma.recurringTransaction.update({
      where: { id },
      data: prismaUpdate,
    });
    return {
      ...updated,
      amount_cents: Math.round((updated.amount ?? 0) * 100),
      type: (updated.amount ?? 0) >= 0 ? "income" : "expense",
    };
  },

  async deleteRecurring(id: string, userId: string) {
    const existing = await prisma.recurringTransaction.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== userId)
      throw new Error("Not found or not owner");
    return prisma.recurringTransaction.delete({ where: { id } });
  },

  async toggleActive(id: string, active: boolean, userId: string) {
    const existing = await prisma.recurringTransaction.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== userId)
      throw new Error("Not found or not owner");
    return prisma.recurringTransaction.update({
      where: { id },
      data: { active },
    });
  },

  async list(filter: any = {}) {
    const where: any = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.active !== undefined) where.active = filter.active;
    const rows = await prisma.recurringTransaction.findMany({
      where,
      orderBy: { nextRunAt: "asc" },
    });
    return rows.map((r) => ({
      ...r,
      amount_cents: Math.round((r.amount ?? 0) * 100),
      type: (r.amount ?? 0) >= 0 ? "income" : "expense",
    }));
  },

  async getById(id: string, userId?: string) {
    const rec = await prisma.recurringTransaction.findUnique({ where: { id } });
    if (!rec) return null;
    if (userId && rec.userId !== userId) throw new Error("Not owner");
    return {
      ...rec,
      amount_cents: Math.round((rec.amount ?? 0) * 100),
      type: (rec.amount ?? 0) >= 0 ? "income" : "expense",
    };
  },

  async listDueRecurrings(now = new Date(), limit = 100) {
    return prisma.recurringTransaction.findMany({
      where: { active: true, nextRunAt: { lte: now } },
      orderBy: { nextRunAt: "asc" },
      take: limit,
    });
  },

  // Recurrence calculation supporting DAILY, WEEKLY, MONTHLY, YEARLY
  calculateNextRun(recurring: any, fromDate?: Date): Date | null {
    const interval = recurring.interval ?? 1;
    const freq: string = recurring.frequency;
    const endDate = recurring.endDate ? new Date(recurring.endDate) : null;
    const start = fromDate
      ? new Date(fromDate)
      : recurring.nextRunAt
        ? new Date(recurring.nextRunAt)
        : recurring.startDate
          ? new Date(recurring.startDate)
          : new Date();

    const clampToEnd = (d: Date | null) => {
      if (!d) return null;
      if (endDate && d > endDate) return null;
      return d;
    };

    const daysInMonth = (y: number, m: number) =>
      new Date(y, m + 1, 0).getDate();

    const parseDaysOfWeek = (
      val: string | null | undefined,
    ): number[] | null => {
      if (!val) return null;
      const parts = val
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      const nums: number[] = parts
        .map((p: string) => {
          const n = Number(p);
          if (Number.isNaN(n)) return -1;
          // allow 1-7 (Mon-Sun) or 0-6 (Sun-Sat). Normalize to 0-6 (Sun=0)
          if (n >= 1 && n <= 7) return n % 7;
          return n;
        })
        .filter((n: number) => n >= 0 && n <= 6);
      return nums.length ? nums : null;
    };

    if (freq === "DAILY") {
      const next = new Date(start);
      next.setDate(next.getDate() + interval);
      return clampToEnd(next);
    }

    if (freq === "WEEKLY") {
      const days = parseDaysOfWeek(recurring.daysOfWeek);
      const now = start;
      if (days) {
        // find next day in the coming weeks respecting interval
        for (let week = 0; week < 52; week += interval) {
          for (const d of days) {
            const candidate = new Date(now);
            const dayOffset = (d - candidate.getDay() + 7) % 7;
            candidate.setDate(candidate.getDate() + dayOffset + week * 7);
            if (candidate > start) return clampToEnd(candidate);
          }
        }
        return null;
      } else {
        const next = new Date(start);
        next.setDate(next.getDate() + interval * 7);
        return clampToEnd(next);
      }
    }

    if (freq === "MONTHLY") {
      const day = recurring.dayOfMonth ?? start.getDate();
      const candidate = new Date(start);
      for (let i = 1; i <= 120; i++) {
        const add = interval * i;
        const y = candidate.getFullYear();
        const m = candidate.getMonth() + add;
        const targetYear = y + Math.floor(m / 12);
        const targetMonth = ((m % 12) + 12) % 12;
        const dim = daysInMonth(targetYear, targetMonth);
        const dayOfMonth = Math.min(day, dim);
        const dt = new Date(
          targetYear,
          targetMonth,
          dayOfMonth,
          candidate.getHours(),
          candidate.getMinutes(),
          candidate.getSeconds(),
        );
        if (dt > start) return clampToEnd(dt);
      }
      return null;
    }

    if (freq === "YEARLY") {
      const candidate = new Date(start);
      const month = candidate.getMonth();
      const date = candidate.getDate();
      for (let i = 1; i <= 20; i++) {
        const y = candidate.getFullYear() + interval * i;
        const dim = daysInMonth(y, month);
        const dayOfMonth = Math.min(date, dim);
        const dt = new Date(y, month, dayOfMonth);
        if (dt > start) return clampToEnd(dt);
      }
      return null;
    }

    return null;
  },

  // Materialize a single occurrence: create Transaction and update nextRunAt
  async materializeOccurrence(recurring: any, txClient?: any) {
    // Determine base date for this occurrence: prefer nextRunAt, then startDate, else now
    const baseDate = recurring.nextRunAt
      ? new Date(recurring.nextRunAt)
      : recurring.startDate
        ? new Date(recurring.startDate)
        : new Date();
    const next = this.calculateNextRun(recurring, baseDate);

    if (txClient) {
      const created = await txClient.transaction.create({
        data: {
          amount: recurring.amount,
          currency: recurring.currency,
          category: recurring.category,
          description: recurring.description,
          date: baseDate,
          userId: recurring.userId,
          recurringId: recurring.id,
        },
      });

      await txClient.recurringTransaction.update({
        where: { id: recurring.id },
        data: { nextRunAt: next },
      });
      return created;
    }

    return prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          amount: recurring.amount,
          currency: recurring.currency,
          category: recurring.category,
          description: recurring.description,
          date: baseDate,
          userId: recurring.userId,
          recurringId: recurring.id,
        },
      });

      await tx.recurringTransaction.update({
        where: { id: recurring.id },
        data: { nextRunAt: next },
      });
      return created;
    });
  },
};

export default recurringService;
