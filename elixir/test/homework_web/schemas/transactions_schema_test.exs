defmodule HomeworkWeb.Schemas.TransactionsSchemaTest do
  use HomeworkWeb.ConnCase

  alias Homework.Factory

  @company_fragment """
  fragment CompanyFields on Company {
    id
    available_credit
    name
    credit_line
    inserted_at
    updated_at
  }
  """

  @merchant_fragment """
  fragment MerchantFields on Merchant {
    id
    name
    description
    inserted_at
    updated_at
  }
  """

  @user_fragment """
    fragment UserFields on User {
      id
      dob
      first_name
      last_name
      inserted_at
      updated_at
    }
  """

  @fragment """
  fragment TransactionFields on Transaction {
    id
    user_id
    amount
    credit
    debit
    description
    merchant_id
    inserted_at
    updated_at
    company {
      ...CompanyFields
    }
    user {
      ...UserFields
    }
    merchant {
      ...MerchantFields
    }
  }
  #{@company_fragment}
  #{@merchant_fragment}
  #{@user_fragment}
  """

  describe "transactions query" do
    @query """
    query {
      transactions {
        ...TransactionFields
      }
    }
    #{@fragment}
    """

    test "success: return empty transactions query", %{conn: conn} do
      params = %{"query" => @query}

      %{"data" => %{"transactions" => transactions}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert transactions == []
    end

    test "success: return transactions query", %{conn: conn} do
      num_of_transactions = 5
      Factory.insert_list(num_of_transactions, :transaction)
      params = %{"query" => @query}

      %{"data" => %{"transactions" => transactions}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert length(transactions) == num_of_transactions
    end
  end

  describe "create transaction mutation" do
    alias Homework.Repo
    alias Homework.Transactions.Transaction

    @query """
    mutation create_transaction(
      $company_id: ID!,
      $user_id: ID!,
      $merchant_id: ID!,
      $amount: DecimalAmount!,
      $credit: Boolean!,
      $debit: Boolean!,
      $description: String!
    ) {
      create_transaction(
        company_id: $company_id,
        user_id: $user_id,
        merchant_id: $merchant_id,
        amount: $amount,
        credit: $credit,
        debit: $debit,
        description: $description
      ) {
        ...TransactionFields
      }
    }
    #{@fragment}
    """

    test "success: return create transaction mutation", %{conn: conn} do
      company = Factory.insert(:company)
      user = Factory.insert(:user, company: company)
      merchant = Factory.insert(:merchant)

      build_transaction =
        Factory.build(:transaction, company: company, user: user, merchant: merchant)

      amount = 10.0

      params = %{
        "query" => @query,
        "variables" => %{
          "company_id" => company.id,
          "user_id" => user.id,
          "merchant_id" => merchant.id,
          "amount" => amount,
          "credit" => build_transaction.credit,
          "debit" => build_transaction.debit,
          "description" => build_transaction.description
        }
      }

      %{"data" => %{"create_transaction" => create_transaction}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert create_transaction["id"]
      assert create_transaction["inserted_at"]
      assert create_transaction["updated_at"]
      assert create_transaction["amount"] == "10.00"
      assert create_transaction["credit"] == build_transaction.credit
      assert create_transaction["debit"] == build_transaction.debit
      assert create_transaction["description"] == build_transaction.description
      assert create_transaction["user"]["id"] == user.id
      assert create_transaction["user"]["dob"] == user.dob
      assert create_transaction["user"]["first_name"] == user.first_name
      assert create_transaction["user"]["last_name"] == user.last_name
      assert create_transaction["merchant"]["id"] == merchant.id
      assert create_transaction["merchant"]["name"] == merchant.name
      assert create_transaction["merchant"]["description"] == merchant.description
      assert create_transaction["company"]["id"] == company.id
      assert create_transaction["company"]["available_credit"] == "999990.00"
      assert create_transaction["company"]["credit_line"] == "1000000.00"
      assert create_transaction["company"]["name"] == company.name

      transaction = Repo.get(Transaction, create_transaction["id"])
      assert transaction.amount == 1000
    end
  end

  describe "update transaction mutation" do
    alias Homework.Repo
    alias Homework.Transactions.Transaction

    @query """
    mutation update_transaction(
      $id: ID!,
      $company_id: ID!,
      $user_id: ID!,
      $merchant_id: ID!,
      $amount: DecimalAmount!,
      $credit: Boolean!,
      $debit: Boolean!,
      $description: String!
    ) {
      update_transaction(
        id: $id,
        company_id: $company_id,
        user_id: $user_id,
        merchant_id: $merchant_id,
        amount: $amount,
        credit: $credit,
        debit: $debit,
        description: $description
      ) {
        ...TransactionFields
      }
    }
    #{@fragment}
    """

    test "success: return update transaction mutation", %{conn: conn} do
      user = Factory.insert(:user)
      merchant = Factory.insert(:merchant)
      transaction = Factory.insert(:transaction, user: user, merchant: merchant)

      update_company = Factory.insert(:company, credit_line: 100_000, name: "update company name")
      update_user = Factory.insert(:user, first_name: "Mary", last_name: "Jane")
      update_merchant = Factory.insert(:merchant, name: "Mary Jane")
      update_amount = "100.00"
      update_credit = !transaction.credit
      update_debit = !transaction.debit

      update_description =
        "Mary Jane Watson is a fictional character appearing in American comic books published by Marvel Comics."

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => transaction.id,
          "company_id" => update_company.id,
          "user_id" => update_user.id,
          "merchant_id" => update_merchant.id,
          "amount" => update_amount,
          "credit" => update_credit,
          "debit" => update_debit,
          "description" => update_description
        }
      }

      %{"data" => %{"update_transaction" => update_transaction}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert update_transaction["inserted_at"]
      assert update_transaction["updated_at"]
      assert update_transaction["id"] == transaction.id
      assert update_transaction["amount"] == update_amount
      assert update_transaction["credit"] == update_credit
      assert update_transaction["debit"] == update_debit
      assert update_transaction["description"] == update_description
      assert update_transaction["user"]["id"] == update_user.id
      assert update_transaction["user"]["dob"] == update_user.dob
      assert update_transaction["user"]["first_name"] == update_user.first_name
      assert update_transaction["user"]["last_name"] == update_user.last_name
      assert update_transaction["merchant"]["id"] == update_merchant.id
      assert update_transaction["merchant"]["name"] == update_merchant.name
      assert update_transaction["merchant"]["description"] == update_merchant.description
      assert update_transaction["company"]["id"] == update_company.id
      assert update_transaction["company"]["available_credit"] == "1000.00"
      assert update_transaction["company"]["credit_line"] == "1000.00"
      assert update_transaction["company"]["name"] == update_company.name

      transaction = Repo.get(Transaction, transaction.id)
      assert transaction.amount == 10_000
    end
  end

  describe "delete transaction mutation" do
    alias Homework.Repo
    alias Homework.Merchants.Merchant
    alias Homework.Transactions.Transaction
    alias Homework.Users.User

    @query """
    mutation delete_transaction($id: ID!) {
      delete_transaction(id: $id) {
        ...TransactionFields
      }
    }
    #{@fragment}
    """

    test "success: return delete transaction mutation", %{conn: conn} do
      user = Factory.insert(:user)
      merchant = Factory.insert(:merchant)
      transaction = Factory.insert(:transaction, user: user, merchant: merchant)

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => transaction.id
        }
      }

      %{"data" => %{"delete_transaction" => delete_transaction}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert delete_transaction["id"] == transaction.id
      assert Repo.get(Merchant, merchant.id)
      assert Repo.get(User, user.id)
      refute Repo.get(Transaction, transaction.id)
    end
  end
end
