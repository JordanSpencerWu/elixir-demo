defmodule HomeworkWeb.Resolvers.TransactionsResolver do
  @moduledoc """
  The Resolver for Transactions
  """

  alias Homework.Companies
  alias Homework.Merchants
  alias Homework.Paginator
  alias Homework.Transactions
  alias Homework.Users

  @doc """
  Get a list of transcations
  """
  def transactions(_root, args, _info) do
    transactions = Transactions.list_transactions(args.filter)
    opts = args |> Map.take([:limit, :skip]) |> Enum.into([])

    Paginator.paginate(transactions, opts)
  end

  @doc """
  Get a transcation
  """
  def transaction(_root, args, _info) do
    transaction = Transactions.get_transaction!(args.id)

    {:ok, transaction}
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end

  @doc """
  Get the company associated with a transaction
  """
  def companies_by_ids(_args, company_ids) do
    companies = Companies.list_companies(%{ids: company_ids})
    Map.new(companies, fn company -> {company.id, company} end)
  end

  @doc """
  Get the user associated with a transaction
  """
  def users_by_ids(_args, users_ids) do
    users = Users.list_users(%{ids: users_ids})
    Map.new(users, fn user -> {user.id, user} end)
  end

  @doc """
  Get the merchant associated with a transaction
  """
  def merchants_by_ids(_args, merchant_ids) do
    merchants = Merchants.list_merchants(%{ids: merchant_ids})
    Map.new(merchants, fn merchant -> {merchant.id, merchant} end)
  end

  @doc """
  Create a new transaction
  """
  def create_transaction(_root, args, _info) do
    Transactions.create_transaction(args)
  end

  @doc """
  Updates a transaction for an id with args specified.
  """
  def update_transaction(_root, %{id: id} = args, _info) do
    transaction = Transactions.get_transaction!(id)

    Transactions.update_transaction(transaction, args)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end

  @doc """
  Deletes a transaction for an id
  """
  def delete_transaction(_root, %{id: id}, _info) do
    transaction = Transactions.get_transaction!(id)

    Transactions.delete_transaction(transaction)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end
end
