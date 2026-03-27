import { recurringService } from '@/services/recurringService';

export default async function toggleRecurringActive(_parent: any, args: { id: string; active: boolean }, ctx: any) {
  const userId = ctx?.user?.id;
  if (!userId) throw new Error('Not authenticated');
  return recurringService.toggleActive(args.id, args.active, userId);
}
