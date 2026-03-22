import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
	mutation CreateTransaction(
		$amount: Float!
		$currency: String!
		$date: String!
		$category: String!
		$description: String
	) {
		createTransaction(
			amount: $amount
			currency: $currency
			date: $date
			category: $category
			description: $description
		) {
			id
			amount
			currency
			date
			category
			description
		}
	}
`;

export const UPDATE_TRANSACTION = gql`
	mutation UpdateTransaction(
		$id: String!
		$amount: Float
		$currency: String
		$date: String
		$category: String
		$description: String
	) {
		updateTransaction(
			id: $id
			amount: $amount
			currency: $currency
			date: $date
			category: $category
			description: $description
		) {
			id
			amount
			currency
			date
			category
			description
		}
	}
`;

export const DELETE_TRANSACTION = gql`
	mutation DeleteTransaction($id: String!) {
		deleteTransaction(id: $id) {
			id
			amount
			currency
			date
			category
			description
		}
	}
`;
