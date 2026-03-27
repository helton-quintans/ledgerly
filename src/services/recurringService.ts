import { prisma } from '../lib/prisma';

export const recurringService = {
  async createRecurring(data: any, userId: string) {
    const payload = { ...data, userId };
    return prisma.recurringTransaction.create({ data: payload });
  },

  async updateRecurring(input: any, userId: string) {
    const { id, ...rest } = input;
    const existing = await prisma.recurringTransaction.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) throw new Error('Not found or not owner');
    return prisma.recurringTransaction.update({ where: { id }, data: rest });
  },

  async deleteRecurring(id: string, userId: string) {
    const existing = await prisma.recurringTransaction.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) throw new Error('Not found or not owner');
    return prisma.recurringTransaction.delete({ where: { id } });
  },

  async toggleActive(id: string, active: boolean, userId: string) {
    const existing = await prisma.recurringTransaction.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) throw new Error('Not found or not owner');
    return prisma.recurringTransaction.update({ where: { id }, data: { active } });
  },

  async list(filter: any = {}) {
    const where: any = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.active !== undefined) where.active = filter.active;
    return prisma.recurringTransaction.findMany({ where, orderBy: { nextRunAt: 'asc' } });
  },

  async getById(id: string, userId?: string) {
    const rec = await prisma.recurringTransaction.findUnique({ where: { id } });
    if (!rec) return null;
    if (userId && rec.userId !== userId) throw new Error('Not owner');
    return rec;
  },

  async listDueRecurrings(now = new Date(), limit = 100) {
    return prisma.recurringTransaction.findMany({
      where: { active: true, nextRunAt: { lte: now } },
      orderBy: { nextRunAt: 'asc' },
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

    const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

    const parseDaysOfWeek = (val: string | null | undefined): number[] | null => {
      if (!val) return null;
      const parts = val
        .split(',')
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

    if (freq === 'DAILY') {
      let next = new Date(start);
      next.setDate(next.getDate() + interval);
      return clampToEnd(next);
    }

    if (freq === 'WEEKLY') {
      const days = parseDaysOfWeek(recurring.daysOfWeek);
      const now = start;
      if (days) {
        // find next day in the coming weeks respecting interval
        for (let week = 0; week < 52; week += interval) {
          for (let d of days) {
            const candidate = new Date(now);
            const dayOffset = ((d - candidate.getDay()) + 7) % 7;
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

    if (freq === 'MONTHLY') {
      const day = recurring.dayOfMonth ?? start.getDate();
      let candidate = new Date(start);
      for (let i = 1; i <= 120; i++) {
        const add = interval * i;
        const y = candidate.getFullYear();
        const m = candidate.getMonth() + add;
        const targetYear = y + Math.floor(m / 12);
        const targetMonth = (m % 12 + 12) % 12;
        const dim = daysInMonth(targetYear, targetMonth);
        const dayOfMonth = Math.min(day, dim);
        const dt = new Date(targetYear, targetMonth, dayOfMonth, candidate.getHours(), candidate.getMinutes(), candidate.getSeconds());
        if (dt > start) return clampToEnd(dt);
      }
      return null;
    }

    if (freq === 'YEARLY') {
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
    const baseDate = recurring.nextRunAt ? new Date(recurring.nextRunAt) : recurring.startDate ? new Date(recurring.startDate) : new Date();
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

      await txClient.recurringTransaction.update({ where: { id: recurring.id }, data: { nextRunAt: next } });
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

      await tx.recurringTransaction.update({ where: { id: recurring.id }, data: { nextRunAt: next } });
      return created;
    });
  },
};

export default recurringService;
