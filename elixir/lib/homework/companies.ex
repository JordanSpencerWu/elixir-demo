defmodule Homework.Companies do
  @moduledoc """
  The Companies context.
  """

  import Ecto.Query, warn: false
  import Homework.Companies.CompanyQueries, only: [base_query: 0, build_query: 2]

  alias Homework.Companies.Company
  alias Homework.Repo

  @doc """
  Returns the list of companies.

  ## Examples

      iex> list_companies()
      [%Company{}, ...]

  """
  @spec list_companies(map) :: [Company.t()]
  def list_companies(criteria \\ %{}) do
    base_query()
    |> build_query(criteria)
    |> Repo.all()
  end

  @doc """
  Gets a single company.

  Raises `Ecto.NoResultsError` if the Company does not exist.

  ## Examples

      iex> get_company!("3f8d5bf5-264d-409c-a742-eb3dc2de831b")
      %Company{}

      iex> get_company!("d100bfb6-b148-45c7-bd9f-cb29bbcb823c")
      ** (Ecto.NoResultsError)

  """
  @spec get_company!(Ecto.UUID.t()) :: Company.t()
  def get_company!(id), do: Repo.get!(Company, id)

  @doc """
  Creates a company.

  ## Examples

      iex> create_company(%{field: value})
      {:ok, %Company{}}

      iex> create_company(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_company(map) :: {:ok, Company.t()} | {:error, Ecto.Changeset.t()}
  def create_company(attrs \\ %{}) do
    %Company{}
    |> Company.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a company.

  ## Examples

      iex> update_company(company, %{field: new_value})
      {:ok, %Company{}}

      iex> update_company(company, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec update_company(Company.t(), map) :: {:ok, Company.t()} | {:error, Ecto.Changeset.t()}
  def update_company(%Company{} = company, attrs) do
    company
    |> Company.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a company.

  ## Examples

      iex> delete_company(company)
      {:ok, %Company{}}

      iex> delete_company(company)
      {:error, %Ecto.Changeset{}}

  """
  @spec delete_company(Company.t()) :: {:ok, Company.t()} | {:error, Ecto.Changeset.t()}
  def delete_company(%Company{} = company) do
    Repo.delete(company)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking company changes.

  ## Examples

      iex> change_company(company)
      %Ecto.Changeset{data: %Company{}}

  """
  @spec change_company(Company.t(), map) :: Ecto.Changeset.t()
  def change_company(%Company{} = company, attrs \\ %{}) do
    Company.changeset(company, attrs)
  end

  @doc """
  The available credit is the company's credit line minus the total amount of credit transactions for the company.
  """
  def calculate_available_credit(credit_line, transactions) do
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
  end

  @doc """
  Preload loads Company associations
  """
  @spec preload([Company.t()] | Company.t(), [atom], keyword) :: [Company.t()] | Company.t() | nil
  def preload(structs_or_struct, preloads, opts \\ []) do
    Repo.preload(structs_or_struct, preloads, opts)
  end
end
