defmodule Homework.Merchants.MerchantQueries do
  @moduledoc """
  Define Merchant queries
  """

  import Ecto.Query, warn: false
  alias Homework.Merchants.Merchant

  def base_query do
    from(m in Merchant, order_by: [desc: m.inserted_at])
  end

  def build_query(query, criteria, opts \\ []) do
    with_deleted = Keyword.get(opts, :with_deleted, false)

    query = Enum.reduce(criteria, query, &compose_query/2)

    if with_deleted do
      query
    else
      query |> not_deleted_query()
    end
  end

  defp compose_query({:ids, merchant_ids}, query) do
    where(query, [m], m.id in ^merchant_ids)
  end

  defp compose_query({:search_by_name, name}, query) do
    start_character = String.slice(name, 0..1)

    from(
      m in query,
      where: ilike(m.name, ^"#{start_character}%"),
      where: fragment("SIMILARITY(?, ?) > 0", m.name, ^name),
      order_by: fragment("LEVENSHTEIN(?, ?)", m.name, ^name)
    )
  end

  defp not_deleted_query(query) do
    epoch = DateTime.from_unix!(0) |> DateTime.to_naive()

    from(
      m in query,
      where: m.deleted_at == ^epoch
    )
  end
end
