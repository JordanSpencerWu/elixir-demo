defmodule HomeworkWeb.Resolvers.CompaniesResolver do
  @moduledoc """
  The Resolver for Companies
  """

  alias Homework.Companies
  alias Homework.Paginator
  alias Homework.Transactions

  @doc """
  Get available credit
  """
  def available_credit(company, _args, _info) do
    credit_line = company.credit_line

    criteria = %{
      company_id: company.id
    }

    transactions = Transactions.list_transactions(criteria)

    available_credit =
      Enum.reduce(
        transactions,
        credit_line,
        fn transaction, acc ->
          if transaction.credit do
            acc - transaction.amount
          else
            acc
          end
        end
      )

    {:ok, available_credit}
  end

  @doc """
  Get a list of companies
  """
  def companies(_root, args, _info) do
    companies = Companies.list_companies()
    opts = args |> Map.take([:limit, :skip]) |> Enum.into([])

    case Paginator.paginate(companies, opts) do
      {:ok, page} -> {:ok, page}
      {:error, message} -> {:error, message}
    end
  end

  @doc """
  Create a new company
  """
  def create_company(_root, args, _info) do
    case Companies.create_company(args) do
      {:ok, company} ->
        {:ok, company}

      error ->
        {:error, "could not create company: #{inspect(error)}"}
    end
  end

  @doc """
  Updates a company for an id with args specified.
  """
  def update_company(_root, %{id: id} = args, _info) do
    company = Companies.get_company!(id)

    case Companies.update_company(company, args) do
      {:ok, company} ->
        {:ok, company}

      error ->
        {:error, "could not update company: #{inspect(error)}"}
    end
  end

  @doc """
  Deletes a company for an id
  """
  def delete_company(_root, %{id: id}, _info) do
    company = Companies.get_company!(id)

    case Companies.delete_company(company) do
      {:ok, company} ->
        {:ok, company}

      error ->
        {:error, "could not update company: #{inspect(error)}"}
    end
  end
end
