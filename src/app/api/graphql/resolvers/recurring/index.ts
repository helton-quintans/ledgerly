import getRecurrings from '../queries/recurring/getRecurrings';
import getRecurring from '../queries/recurring/getRecurring';
import createRecurring from '../mutations/recurring/createRecurring';
import updateRecurring from '../mutations/recurring/updateRecurring';
import deleteRecurring from '../mutations/recurring/deleteRecurring';
import toggleRecurringActive from '../mutations/recurring/toggleRecurringActive';

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
