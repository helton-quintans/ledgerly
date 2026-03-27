import { recurringService } from '@/services/recurringService';

export default async function createRecurring(_parent: any, args: { input: any }, ctx: any) {
  const userId = ctx?.user?.id;
  if (!userId) throw new Error('Not authenticated');
  return recurringService.createRecurring(args.input, userId);
}
