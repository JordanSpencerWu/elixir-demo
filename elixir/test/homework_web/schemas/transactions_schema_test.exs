defmodule HomeworkWeb.Schemas.TransactionsSchemaTest do
  use HomeworkWeb.ConnCase, async: true

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
      company_id
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
    company_id
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
    query transactions($filter: TransactionFilter) {
      transactions(filter: $filter) {
        entries {
          __typename
          ... on Transaction {
            ...TransactionFields
          }
        }
        offset
        total_rows
      }
    }
    #{@fragment}
    """

    test "success: return empty transactions query", %{conn: conn} do
      params = %{"query" => @query}

      %{
        "data" => %{
          "transactions" => %{
            "entries" => transactions,
            "offset" => offset,
            "total_rows" => total_rows
          }
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert transactions == []
      assert offset == 0
      assert total_rows == 0
    end

    test "success: return transactions query", %{conn: conn} do
      num_of_transactions = 5
      now = DateTime.utc_now() |> DateTime.to_naive()
      Factory.insert_list(num_of_transactions, :transaction)
      Factory.insert(:transaction, deleted_at: now)

      params = %{"query" => @query}

      %{
        "data" => %{
          "transactions" => %{
            "entries" => transactions,
            "offset" => offset,
            "total_rows" => total_rows
          }
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(transactions) == num_of_transactions
      assert offset == num_of_transactions
      assert total_rows == num_of_transactions
    end

    test "success: return transactions query filtered by company", %{conn: conn} do
      num_of_transactions = 5
      company = Factory.insert(:company)
      Factory.insert_list(num_of_transactions, :transaction, company: company)
      Factory.insert(:transaction)

      params = %{
        "query" => @query,
        "variables" => %{
          "filter" => %{
            "company_id" => company.id
          }
        }
      }

      %{
        "data" => %{
          "transactions" => %{
            "entries" => transactions,
            "offset" => offset,
            "total_rows" => total_rows
          }
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(transactions) == num_of_transactions
      assert offset == num_of_transactions
      assert total_rows == num_of_transactions
    end

    test "success: return transactions query filtered by merchant", %{conn: conn} do
      num_of_transactions = 5
      merchant = Factory.insert(:merchant)
      Factory.insert_list(num_of_transactions, :transaction, merchant: merchant)
      Factory.insert(:transaction)

      params = %{
        "query" => @query,
        "variables" => %{
          "filter" => %{
            "merchant_id" => merchant.id
          }
        }
      }

      %{
        "data" => %{
          "transactions" => %{
            "entries" => transactions,
            "offset" => offset,
            "total_rows" => total_rows
          }
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(transactions) == num_of_transactions
      assert offset == num_of_transactions
      assert total_rows == num_of_transactions
    end

    test "success: return transactions query filtered by user", %{conn: conn} do
      num_of_transactions = 5
      user = Factory.insert(:user)
      Factory.insert_list(num_of_transactions, :transaction, user: user)
      Factory.insert(:transaction)

      params = %{
        "query" => @query,
        "variables" => %{
          "filter" => %{
            "user_id" => user.id
          }
        }
      }

      %{
        "data" => %{
          "transactions" => %{
            "entries" => transactions,
            "offset" => offset,
            "total_rows" => total_rows
          }
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(transactions) == num_of_transactions
      assert offset == num_of_transactions
      assert total_rows == num_of_transactions
    end

    test "success: return transactions query filtered by min and max amount", %{conn: conn} do
      min = "100.00"
      max = "10000.00"
      Factory.insert(:transaction, amount: 1_000)
      _min = Factory.insert(:transaction, amount: 10_000)
      _between = Factory.insert(:transaction, amount: 100_000)
      _max = Factory.insert(:transaction, amount: 1_000_000)
      Factory.insert(:transaction, amount: 10_000_000)

      params = %{
        "query" => @query,
        "variables" => %{
          "filter" => %{
            "amount" => %{
              "min" => min,
              "max" => max
            }
          }
        }
      }

      %{
        "data" => %{
          "transactions" => %{
            "entries" => transactions,
            "offset" => offset,
            "total_rows" => total_rows
          }
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(transactions) == 3
      assert offset == 3
      assert total_rows == 3
    end
  end

  describe "transaction query" do
    @query """
    query transaction($id: ID!) {
      transaction(id: $id) {
        ...TransactionFields
      }
    }
    #{@fragment}
    """

    test "success: return transaction query", %{conn: conn} do
      expected_transaction = Factory.insert(:transaction)

      params = %{"query" => @query, "variables" => %{"id" => expected_transaction.id}}

      %{
        "data" => %{
          "transaction" => transaction
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert transaction["id"]
      assert transaction["amount"] == "10.00"
      assert transaction["credit"] == expected_transaction.credit
      assert transaction["debit"] == expected_transaction.debit
      assert transaction["description"] == expected_transaction.description
      assert transaction["company_id"] == expected_transaction.company.id
      assert transaction["merchant_id"] == expected_transaction.merchant.id
      assert transaction["user_id"] == expected_transaction.user.id
      assert transaction["user"]["id"] == expected_transaction.user.id
      assert transaction["user"]["dob"] == expected_transaction.user.dob
      assert transaction["user"]["first_name"] == expected_transaction.user.first_name
      assert transaction["user"]["last_name"] == expected_transaction.user.last_name
      assert transaction["user"]["company_id"] == expected_transaction.user.company_id
      assert transaction["merchant"]["id"] == expected_transaction.merchant.id
      assert transaction["merchant"]["name"] == expected_transaction.merchant.name
      assert transaction["merchant"]["description"] == expected_transaction.merchant.description
      assert transaction["company"]["id"] == expected_transaction.company.id
      assert transaction["company"]["available_credit"] == "1000000.00"
      assert transaction["company"]["credit_line"] == "1000000.00"
      assert transaction["company"]["name"] == expected_transaction.company.name
    end

    test "success: return nil for deleted transaction", %{conn: conn} do
      now = DateTime.utc_now() |> DateTime.to_naive()
      expected_transaction = Factory.insert(:transaction, deleted_at: now)

      params = %{"query" => @query, "variables" => %{"id" => expected_transaction.id}}

      %{
        "data" => %{
          "transaction" => transaction
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert transaction == nil
    end

    test "error: return changeset error", %{conn: conn} do
      invalid_transaction_id = Ecto.UUID.generate()

      params = %{"query" => @query, "variables" => %{"id" => invalid_transaction_id}}

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["transaction"]
               }
             ] = errors
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
      assert create_transaction["company"]["available_credit"] == "1000000.00"
      assert create_transaction["company"]["credit_line"] == "1000000.00"
      assert create_transaction["company"]["name"] == company.name

      transaction = Repo.get(Transaction, create_transaction["id"])
      assert transaction.amount == 1000
    end

    test "error: return changeset error", %{conn: conn} do
      company = Factory.insert(:company)
      user = Factory.insert(:user, company: company)
      merchant = Factory.insert(:merchant)

      build_invalid_transaction =
        Factory.build(:transaction,
          company: company,
          user: user,
          merchant: merchant,
          credit: true,
          debit: true
        )

      amount = 10.0

      params = %{
        "query" => @query,
        "variables" => %{
          "company_id" => company.id,
          "user_id" => user.id,
          "merchant_id" => merchant.id,
          "amount" => amount,
          "credit" => build_invalid_transaction.credit,
          "debit" => build_invalid_transaction.debit,
          "description" => build_invalid_transaction.description
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 10}],
                 "message" => "credit: invalid value, cannot be true when debit is true",
                 "path" => ["create_transaction"]
               },
               %{
                 "locations" => [%{"column" => 3, "line" => 10}],
                 "message" => "debit: invalid value, cannot be true when credit is true",
                 "path" => ["create_transaction"]
               }
             ] == errors
    end
  end

  describe "update transaction mutation" do
    alias Homework.Repo
    alias Homework.Transactions.Transaction

    @query """
    mutation update_transaction(
      $id: ID!,
      $company_id: ID,
      $user_id: ID,
      $merchant_id: ID,
      $amount: DecimalAmount,
      $credit: Boolean,
      $debit: Boolean,
      $description: String
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
      assert update_transaction["company"]["available_credit"] == "900.00"
      assert update_transaction["company"]["credit_line"] == "1000.00"
      assert update_transaction["company"]["name"] == update_company.name

      transaction = Repo.get(Transaction, transaction.id)
      assert transaction.amount == 10_000
    end

    test "error: return changeset error", %{conn: conn} do
      user = Factory.insert(:user)
      merchant = Factory.insert(:merchant)
      transaction = Factory.insert(:transaction, user: user, merchant: merchant)

      update_credit = true
      update_debit = true

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => transaction.id,
          "credit" => update_credit,
          "debit" => update_debit
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 11}],
                 "message" => "credit: invalid value, cannot be true when debit is true",
                 "path" => ["update_transaction"]
               },
               %{
                 "locations" => [%{"column" => 3, "line" => 11}],
                 "message" => "debit: invalid value, cannot be true when credit is true",
                 "path" => ["update_transaction"]
               }
             ] == errors
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_transaction_id = Ecto.UUID.generate()

      update_credit = true
      update_debit = false

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_transaction_id,
          "credit" => update_credit,
          "debit" => update_debit
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 11}],
                 "message" => "id: invalid value",
                 "path" => ["update_transaction"]
               }
             ] == errors
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

      transaction = Repo.get(Transaction, transaction.id)
      assert transaction.deleted_at != DateTime.from_unix!(0) |> DateTime.to_naive()
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_transaction_id = Ecto.UUID.generate()

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_transaction_id
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["delete_transaction"]
               }
             ] == errors
    end
  end
end
