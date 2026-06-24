import { print } from 'graphql';

async function graphqlFetch(query: string | any, variables: any) {
  const queryString = typeof query === 'string' ? query : print(query);
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: queryString, variables }),
    credentials: 'same-origin',
  });
  const { data, errors } = await res.json();
  if (errors) throw errors;
  return data;
}

const GET_RECURRENCIES = `
  query GetRecurrings {
    recurringTransactions {
      items {
        id
        amount
        currency
        frequency
        interval
        dayOfMonth
        daysOfWeek
        startDate
        endDate
        nextRunAt
        active
        description
        category
        type
      }
    }
  }
`;

const CREATE_RECURRING = `
  mutation CreateRecurring($input: CreateRecurringInput!) {
    createRecurringTransaction(input: $input) {
      id
    }
  }
`;

const UPDATE_RECURRING = `
  mutation UpdateRecurring($input: UpdateRecurringInput!) {
    updateRecurringTransaction(input: $input) {
      id
    }
  }
`;

const DELETE_RECURRING = `
  mutation DeleteRecurring($id: ID!) {
    deleteRecurringTransaction(id: $id)
  }
`;

const TOGGLE_ACTIVE = `
  mutation ToggleRecurringActive($id: ID!, $active: Boolean!) {
    toggleRecurringActive(id: $id, active: $active) {
      id
      active
    }
  }
`;

export async function listRecurrings() {
  const data = await graphqlFetch(GET_RECURRENCIES, {});
  return data.recurringTransactions?.items ?? [];
}

export async function createRecurring(input: any) {
  const data = await graphqlFetch(CREATE_RECURRING, { input });
  return data.createRecurringTransaction;
}

export async function updateRecurring(input: any) {
  const data = await graphqlFetch(UPDATE_RECURRING, { input });
  return data.updateRecurringTransaction;
}

export async function deleteRecurring(id: string) {
  const data = await graphqlFetch(DELETE_RECURRING, { id });
  return data.deleteRecurringTransaction;
}

export async function toggleRecurringActive(id: string, active: boolean) {
  const data = await graphqlFetch(TOGGLE_ACTIVE, { id, active });
  return data.toggleRecurringActive;
}

export default {
  listRecurrings,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  toggleRecurringActive,
};
