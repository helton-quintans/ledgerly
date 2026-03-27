import { recurringService } from '@/services/recurringService';

export default async function getRecurrings(_parent: any, args: any, ctx: any) {
  const userId = ctx?.user?.id;
  // args may include pagination/filters
  return recurringService.list({ userId, ...args });
}
