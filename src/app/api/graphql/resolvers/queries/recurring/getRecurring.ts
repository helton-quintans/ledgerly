import { resolveUserIdFromToken } from "@/lib/auth";
import { recurringService } from "@/services/recurringService";

export default async function getRecurring(
  _parent: any,
  args: { id: string },
  ctx: any,
) {
  const tokenUser = ctx?.user;
  const userId = await resolveUserIdFromToken(tokenUser);
  return recurringService.getById(args.id, userId);
}
