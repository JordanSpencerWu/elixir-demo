defmodule Homework.Merchants.MerchantQueries do
  @moduledoc """
  Define Merchant queries
  """

  import Ecto.Query, warn: false
  alias Homework.Merchants.Merchant

  def base_query do
    from(m in Merchant)
  end

  def build_query(query, criteria) do
    Enum.reduce(criteria, query, &compose_query/2)
  end

  defp compose_query({:ids, merchant_ids}, query) do
    where(query, [m], m.id in ^merchant_ids)
  end
end
