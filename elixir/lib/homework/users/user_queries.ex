defmodule Homework.Users.UserQueries do
  @moduledoc """
  Define User queries
  """

  import Ecto.Query, warn: false
  alias Homework.Users.User

  def base_query do
    from(u in User)
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

  defp compose_query({:company_id, company_id}, query) do
    where(query, [u], u.company_id == ^company_id)
  end

  defp compose_query({:ids, users_ids}, query) do
    where(query, [u], u.id in ^users_ids)
  end

  defp compose_query({:search_by_first_name, first_name}, query) do
    start_character = String.slice(first_name, 0..1)

    from(
      u in query,
      where: ilike(u.first_name, ^"#{start_character}%"),
      where: fragment("SIMILARITY(?, ?) > 0", u.first_name, ^first_name),
      order_by: fragment("LEVENSHTEIN(?, ?)", u.first_name, ^first_name)
    )
  end

  defp compose_query({:search_by_last_name, last_name}, query) do
    start_character = String.slice(last_name, 0..1)

    from(
      u in query,
      where: ilike(u.last_name, ^"#{start_character}%"),
      where: fragment("SIMILARITY(?, ?) > 0", u.last_name, ^last_name),
      order_by: fragment("LEVENSHTEIN(?, ?)", u.last_name, ^last_name)
    )
  end

  defp not_deleted_query(query) do
    epoch = DateTime.from_unix!(0) |> DateTime.to_naive()

    from(
      u in query,
      where: u.deleted_at == ^epoch
    )
  end
end
