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
    Enum.reduce(criteria, query, &compose_query/2)
  end

  defp compose_query({:company_ids, company_ids}, query) do
    where(query, [c], c.id in ^company_ids)
  end
end
