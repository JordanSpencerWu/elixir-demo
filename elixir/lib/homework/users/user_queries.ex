defmodule Homework.Users.UserQueries do
  @moduledoc """
  Define User queries
  """

  import Ecto.Query, warn: false
  alias Homework.Users.User

  def base_query do
    from(u in User)
  end

  def build_query(query, criteria) do
    Enum.reduce(criteria, query, &compose_query/2)
  end

  defp compose_query({:ids, users_ids}, query) do
    where(query, [u], u.id in ^users_ids)
  end
end
