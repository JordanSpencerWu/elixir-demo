defmodule HomeworkWeb.Resolvers.MerchantsResolver do
  @moduledoc """
  The Resolver for Merchants
  """

  alias Homework.Merchants
  alias Homework.Paginator

  @doc """
  Get a list of merchants
  """
  def merchants(_root, args, _info) do
    criteria = args.search
    merchants = Merchants.list_merchants(criteria)
    opts = args |> Map.take([:limit, :skip]) |> Enum.into([])

    case Paginator.paginate(merchants, opts) do
      {:ok, page} -> {:ok, page}
      {:error, message} -> {:error, message}
    end
  end

  @doc """
  Create a new merchant
  """
  def create_merchant(_root, args, _info) do
    Merchants.create_merchant(args)
  end

  @doc """
  Updates a merchant for an id with args specified.
  """
  def update_merchant(_root, %{id: id} = args, _info) do
    merchant = Merchants.get_merchant!(id)

    Merchants.update_merchant(merchant, args)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end

  @doc """
  Deletes a merchant for an id
  """
  def delete_merchant(_root, %{id: id}, _info) do
    merchant = Merchants.get_merchant!(id)

    Merchants.delete_merchant(merchant)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end
end
