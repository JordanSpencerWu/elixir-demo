defmodule Homework.Merchants do
  @moduledoc """
  The Merchants context.
  """

  import Ecto.Query, warn: false
  import Homework.Merchants.MerchantQueries, only: [base_query: 0, build_query: 2]

  alias Homework.Merchants.Merchant
  alias Homework.Repo

  @doc """
  Returns the list of merchants.

  ## Examples

      iex> list_merchants([])
      [%Merchant{}, ...]

  """
  @spec list_merchants(map) :: [Merchant.t()]
  def list_merchants(criteria \\ %{}) do
    base_query()
    |> build_query(criteria)
    |> Repo.all()
  end

  @doc """
  Gets a single merchant.

  Raises `Ecto.NoResultsError` if the Merchant does not exist.

  ## Examples

      iex> get_merchant!("3f8d5bf5-264d-409c-a742-eb3dc2de831b")
      %Merchant{}

      iex> get_merchant!("d100bfb6-b148-45c7-bd9f-cb29bbcb823c")
      ** (Ecto.NoResultsError)

  """
  @spec get_merchant!(Ecto.UUID.t()) :: Merchant.t()
  def get_merchant!(id) do
    epoch = DateTime.from_unix!(0) |> DateTime.to_naive()

    query =
      from(m in Merchant,
        where: m.id == ^id and m.deleted_at == ^epoch
      )

    Repo.one!(query)
  end

  @doc """
  Creates a merchant.

  ## Examples

      iex> create_merchant(%{field: value})
      {:ok, %Merchant{}}

      iex> create_merchant(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_merchant(map) :: {:ok, Merchant.t()} | {:error, Ecto.Changeset.t()}
  def create_merchant(attrs \\ %{}) do
    %Merchant{}
    |> Merchant.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a merchant.

  ## Examples

      iex> update_merchant(merchant, %{field: new_value})
      {:ok, %Merchant{}}

      iex> update_merchant(merchant, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec update_merchant(Merchant.t(), map) :: {:ok, Merchant.t()} | {:error, Ecto.Changeset.t()}
  def update_merchant(%Merchant{} = merchant, attrs) do
    merchant
    |> Merchant.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Soft deletes a merchant.

  ## Examples

      iex> delete_merchant(merchant)
      {:ok, %Merchant{}}

      iex> delete_merchant(merchant)
      {:error, %Ecto.Changeset{}}

  """
  @spec delete_merchant(Merchant.t()) :: {:ok, Merchant.t()} | {:error, Ecto.Changeset.t()}
  def delete_merchant(%Merchant{} = merchant) do
    epoch = DateTime.utc_now() |> DateTime.to_naive()
    attrs = %{deleted_at: epoch}

    update_merchant(merchant, attrs)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking merchant changes.

  ## Examples

      iex> change_merchant(merchant)
      %Ecto.Changeset{data: %Merchant{}}

  """
  @spec change_merchant(Merchant.t(), map) :: Ecto.Changeset.t()
  def change_merchant(%Merchant{} = merchant, attrs \\ %{}) do
    Merchant.changeset(merchant, attrs)
  end
end
