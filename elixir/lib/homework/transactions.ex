defmodule Homework.Transactions do
  @moduledoc """
  The Transactions context.
  """

  import Ecto.Query, except: [preload: 2], warn: false
  import Homework.Transactions.TransactionQueries, only: [base_query: 0, build_query: 2]

  alias Homework.Companies
  alias Homework.Repo
  alias Homework.Transactions.Transaction

  @doc """
  Returns the list of transactions.

  ## Examples

      iex> list_transactions([])
      [%Transaction{}, ...]

  """
  @spec list_transactions(map) :: [Transaction.t()]
  def list_transactions(criteria \\ %{}) do
    base_query()
    |> build_query(criteria)
    |> Repo.all()
  end

  @doc """
  Gets a single transaction.

  Raises `Ecto.NoResultsError` if the Transaction does not exist.

  ## Examples

      iex> get_transaction!("3f8d5bf5-264d-409c-a742-eb3dc2de831b")
      %Transaction{}

      iex> get_transaction!("d100bfb6-b148-45c7-bd9f-cb29bbcb823c")
      ** (Ecto.NoResultsError)

  """
  @spec get_transaction!(Ecto.UUID.t()) :: Transaction.t()
  def get_transaction!(id), do: Repo.get!(Transaction, id)

  @doc """
  Creates a transaction.

  ## Examples

      iex> create_transaction(%{field: value})
      {:ok, %Transaction{}}

      iex> create_transaction(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_transaction(map) :: {:ok, Transaction.t()} | {:error, Ecto.Changeset.t()}
  def create_transaction(attrs \\ %{}) do
    Repo.transaction(fn repo ->
      changeset = Transaction.changeset(%Transaction{}, attrs)

      case Repo.insert(changeset) do
        {:ok, transaction} ->
          available_credit = calculate_company_available_credit(transaction)

          if available_credit >= 0 do
            transaction
          else
            repo.rollback("failed to create transaction: will exceed company's available credit")
          end

        {:error, changeset} ->
          repo.rollback(changeset)
      end
    end)
  end

  @doc """
  Updates a transaction.

  ## Examples

      iex> update_transaction(transaction, %{field: new_value})
      {:ok, %Transaction{}}

      iex> update_transaction(transaction, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec update_transaction(Transaction.t(), map) ::
          {:ok, Transaction.t()} | {:error, Ecto.Changeset.t()}
  def update_transaction(%Transaction{} = transaction, attrs) do
    Repo.transaction(fn repo ->
      changeset = Transaction.changeset(transaction, attrs)

      case Repo.update(changeset) do
        {:ok, transaction} ->
          available_credit = calculate_company_available_credit(transaction)

          if available_credit >= 0 do
            transaction
          else
            repo.rollback("failed to update transaction: will exceed company's available credit")
          end

        {:error, changeset} ->
          repo.rollback(changeset)
      end
    end)
  end

  @doc """
  Deletes a transaction.

  ## Examples

      iex> delete_transaction(transaction)
      {:ok, %Transaction{}}

      iex> delete_transaction(transaction)
      {:error, %Ecto.Changeset{}}

  """
  @spec delete_transaction(Transaction.t()) ::
          {:ok, Transaction.t()} | {:error, Ecto.Changeset.t()}
  def delete_transaction(%Transaction{} = transaction) do
    Repo.delete(transaction)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking transaction changes.

  ## Examples

      iex> change_transaction(transaction)
      %Ecto.Changeset{data: %Transaction{}}

  """
  @spec change_transaction(Transaction.t(), map) :: Ecto.Changeset.t()
  def change_transaction(%Transaction{} = transaction, attrs \\ %{}) do
    Transaction.changeset(transaction, attrs)
  end

  @doc """
  Preload loads Transaction associations
  """
  @spec preload([Transaction.t()] | Transaction.t(), [atom], keyword) ::
          [Transaction.t()] | Transaction.t() | nil
  def preload(structs_or_struct, preloads, opts \\ []) do
    Repo.preload(structs_or_struct, preloads, opts)
  end

  @spec calculate_company_available_credit(Transaction.t()) :: integer
  defp calculate_company_available_credit(transaction) do
    transaction = preload(transaction, :company)
    company = transaction.company
    company_transactions = list_transactions(%{company_id: company.id})

    Companies.calculate_available_credit(company.credit_line, company_transactions)
  end
end
