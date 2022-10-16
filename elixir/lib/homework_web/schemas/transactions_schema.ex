defmodule HomeworkWeb.Schemas.TransactionsSchema do
  @moduledoc """
  Defines the graphql schema for transactions.
  """
  use Absinthe.Schema.Notation

  alias HomeworkWeb.Resolvers.TransactionsResolver

  object :transaction do
    field(:id, non_null(:id))
    field(:amount, :decimal_amount)
    field(:credit, :boolean)
    field(:debit, :boolean)
    field(:description, :string)
    field(:inserted_at, :naive_datetime)
    field(:merchant_id, :id)
    field(:updated_at, :naive_datetime)
    field(:user_id, :id)

    field(:company, :company) do
      resolve(fn transaction, _args, _info ->
        batch(
          {TransactionsResolver, :companies_by_ids},
          transaction.company_id,
          fn batch_results ->
            {:ok, Map.get(batch_results, transaction.company_id)}
          end
        )
      end)
    end

    field(:user, :user) do
      resolve(fn transaction, _args, _info ->
        batch({TransactionsResolver, :users_by_ids}, transaction.user_id, fn batch_results ->
          {:ok, Map.get(batch_results, transaction.user_id)}
        end)
      end)
    end

    field(:merchant, :merchant) do
      resolve(fn transaction, _args, _info ->
        batch(
          {TransactionsResolver, :merchants_by_ids},
          transaction.merchant_id,
          fn batch_results ->
            {:ok, Map.get(batch_results, transaction.merchant_id)}
          end
        )
      end)
    end
  end

  object :transaction_queries do
    @desc "Get all Transactions"
    field(:transactions, :page_result) do
      arg(:limit, :integer, default_value: 50)
      arg(:skip, :integer, default_value: 0)

      resolve(&TransactionsResolver.transactions/3)
    end
  end

  object :transaction_mutations do
    @desc "Create a new transaction"
    field :create_transaction, :transaction do
      arg(:company_id, non_null(:id))
      arg(:user_id, non_null(:id))
      arg(:merchant_id, non_null(:id))
      @desc "amount is in decimal amount"
      arg(:amount, non_null(:decimal_amount))
      arg(:credit, non_null(:boolean))
      arg(:debit, non_null(:boolean))
      arg(:description, non_null(:string))

      resolve(&TransactionsResolver.create_transaction/3)
    end

    @desc "Update a new transaction"
    field :update_transaction, :transaction do
      arg(:id, non_null(:id))
      arg(:company_id, non_null(:id))
      arg(:user_id, non_null(:id))
      arg(:merchant_id, non_null(:id))
      @desc "amount is in decimal amount"
      arg(:amount, non_null(:decimal_amount))
      arg(:credit, non_null(:boolean))
      arg(:debit, non_null(:boolean))
      arg(:description, non_null(:string))

      resolve(&TransactionsResolver.update_transaction/3)
    end

    @desc "delete an existing transaction"
    field :delete_transaction, :transaction do
      arg(:id, non_null(:id))

      resolve(&TransactionsResolver.delete_transaction/3)
    end
  end
end
