import { resolveUserIdFromToken } from "@/lib/auth";
import { recurringService } from "@/services/recurringService";

export default async function deleteRecurring(
  _parent: any,
  args: { id: string },
  ctx: any,
) {
  const tokenUser = ctx?.user;
  const userId = await resolveUserIdFromToken(tokenUser);
  if (!userId) throw new Error("Not authenticated");
  return recurringService.deleteRecurring(args.id, userId);
}
