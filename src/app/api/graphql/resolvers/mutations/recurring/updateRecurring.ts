import { recurringService } from '../../../../services/recurringService';

export default async function updateRecurring(_parent: any, args: { input: any }, ctx: any) {
  const userId = ctx?.user?.id;
  if (!userId) throw new Error('Not authenticated');
  return recurringService.updateRecurring(args.input, userId);
}
