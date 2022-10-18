defmodule Homework.Companies.CompanyQueries do
  @moduledoc """
  Define Company queries
  """

  import Ecto.Query, warn: false
  alias Homework.Companies.Company

  def base_query do
    from(c in Company)
  end

  def build_query(query, criteria) do
    Enum.reduce(criteria, query, &compose_query/2) |> not_deleted_query()
  end

  defp compose_query({:ids, company_ids}, query) do
    where(query, [c], c.id in ^company_ids)
  end

  defp not_deleted_query(query) do
    epoch = DateTime.from_unix!(0) |> DateTime.to_naive()

    from(
      c in query,
      where: c.deleted_at == ^epoch
    )
  end
end
