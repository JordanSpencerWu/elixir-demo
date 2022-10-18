defmodule Homework.Transactions.TransactionQueries do
  @moduledoc """
  Define Transaction queries
  """

  import Ecto.Query, warn: false
  alias Homework.Transactions.Transaction

  def base_query do
    from(t in Transaction)
  end

  def build_query(query, criteria) do
    Enum.reduce(criteria, query, &compose_query/2) |> not_deleted_query()
  end

  defp compose_query({:company_id, company_id}, query) do
    where(query, [t], t.company_id == ^company_id)
  end

  defp compose_query({:amount, %{max: max, min: min}}, query) do
    where(query, [t], t.amount >= ^min and t.amount <= ^max)
  end

  defp compose_query({:merchant_id, merchant_id}, query) do
    where(query, [t], t.merchant_id == ^merchant_id)
  end

  defp compose_query({:user_id, user_id}, query) do
    where(query, [t], t.user_id == ^user_id)
  end

  defp not_deleted_query(query) do
    epoch = DateTime.from_unix!(0) |> DateTime.to_naive()

    from(
      t in query,
      where: t.deleted_at == ^epoch
    )
  end
end
