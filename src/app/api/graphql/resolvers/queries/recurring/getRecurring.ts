import { recurringService } from '@/services/recurringService';

export default async function getRecurring(_parent: any, args: { id: string }, ctx: any) {
  const userId = ctx?.user?.id;
  return recurringService.getById(args.id, userId);
}
