import createRecurring from "../mutations/recurring/createRecurring";
import deleteRecurring from "../mutations/recurring/deleteRecurring";
import toggleRecurringActive from "../mutations/recurring/toggleRecurringActive";
import updateRecurring from "../mutations/recurring/updateRecurring";
import getRecurring from "../queries/recurring/getRecurring";
import getRecurrings from "../queries/recurring/getRecurrings";

export const recurringResolvers = {
  Query: {
    recurringTransactions: getRecurrings,
    recurringTransaction: getRecurring,
  },
  Mutation: {
    createRecurringTransaction: createRecurring,
    updateRecurringTransaction: updateRecurring,
    deleteRecurringTransaction: deleteRecurring,
    toggleRecurringActive: toggleRecurringActive,
  },
};

export default recurringResolvers;
