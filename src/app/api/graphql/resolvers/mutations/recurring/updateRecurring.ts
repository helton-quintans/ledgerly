import { resolveUserIdFromToken } from "@/lib/auth";
import { recurringService } from "@/services/recurringService";

export default async function updateRecurring(
  _parent: any,
  args: { input: any },
  ctx: any,
) {
  const tokenUser = ctx?.user;
  const userId = await resolveUserIdFromToken(tokenUser);
  if (!userId) throw new Error("Not authenticated");
  return recurringService.updateRecurring(args.input, userId);
}
