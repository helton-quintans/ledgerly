import { recurringService } from '@/services/recurringService';

export default async function deleteRecurring(_parent: any, args: { id: string }, ctx: any) {
  const userId = ctx?.user?.id;
  if (!userId) throw new Error('Not authenticated');
  return recurringService.deleteRecurring(args.id, userId);
}
