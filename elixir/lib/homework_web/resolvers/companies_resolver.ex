defmodule HomeworkWeb.Resolvers.CompaniesResolver do
  @moduledoc """
  The Resolver for Companies
  """

  alias Homework.Companies
  alias Homework.Paginator

  @doc """
  Get available credit
  """
  def available_credit_by_companies_by_ids(_args, company_ids) do
    criteria = %{ids: company_ids}

    companies =
      criteria |> Companies.list_companies(with_deleted: true) |> Companies.preload(:transactions)

    for company <- companies, into: %{} do
      epoch = DateTime.utc_now() |> DateTime.to_naive()

      non_deleted_transactions =
        Enum.filter(company.transactions, fn t -> t.deleted_at != epoch end)

      available_credit =
        Companies.calculate_available_credit(company.credit_line, non_deleted_transactions)

      {company.id, available_credit}
    end
  end

  @doc """
  Get a list of companies
  """
  def companies(_root, args, _info) do
    criteria = args.search
    companies = Companies.list_companies(criteria)
    opts = args |> Map.take([:limit, :skip]) |> Enum.into([])

    Paginator.paginate(companies, opts)
  end

  @doc """
  Get a company
  """
  def company(_root, args, _info) do
    company = Companies.get_company!(args.id)

    {:ok, company}
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end

  @doc """
  Create a new company
  """
  def create_company(_root, args, _info) do
    Companies.create_company(args)
  end

  @doc """
  Updates a company for an id with args specified.
  """
  def update_company(_root, %{id: id} = args, _info) do
    company = Companies.get_company!(id)

    Companies.update_company(company, args)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end

  @doc """
  Deletes a company for an id
  """
  def delete_company(_root, %{id: id}, _info) do
    company = Companies.get_company!(id)

    Companies.delete_company(company)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end
end
