import { resolveUserIdFromToken } from "@/lib/auth";
import { recurringService } from "@/services/recurringService";

export default async function getRecurrings(_parent: any, args: any, ctx: any) {
  const tokenUser = ctx?.user;
  const userId = await resolveUserIdFromToken(tokenUser);
  // args may include pagination/filters
  const items = await recurringService.list({ userId, ...args });
  return { items };
}
