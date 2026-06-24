export const recurringType = `
  type RecurringTransaction {
    id: ID!
    userId: ID!
    amount_cents: Int
    amount: Float!
    currency: String!
    category: String!
    description: String
    type: String
    frequency: String!
    interval: Int!
    daysOfWeek: String
    dayOfMonth: Int
    startDate: String
    endDate: String
    nextRunAt: String
    active: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateRecurringInput {
    amount: Float!
    currency: String!
    category: String!
    description: String
    type: String
    frequency: String!
    interval: Int
    daysOfWeek: String
    dayOfMonth: Int
    startDate: String
    endDate: String
  }

  input UpdateRecurringInput {
    id: ID!
    amount: Float
    type: String
    currency: String
    category: String
    description: String
    frequency: String
    interval: Int
    daysOfWeek: String
    dayOfMonth: Int
    startDate: String
    endDate: String
    active: Boolean
  }

  type RecurringPage {
    items: [RecurringTransaction!]!
  }

  type Query {
    recurringTransactions: RecurringPage
    recurringTransaction(id: ID!): RecurringTransaction
  }

  type Mutation {
    createRecurringTransaction(input: CreateRecurringInput!): RecurringTransaction
    updateRecurringTransaction(input: UpdateRecurringInput!): RecurringTransaction
    deleteRecurringTransaction(id: ID!): Boolean
    toggleRecurringActive(id: ID!, active: Boolean!): RecurringTransaction
  }
`;

export default recurringType;
