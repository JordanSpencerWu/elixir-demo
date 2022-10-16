defmodule Homework.Transactions.TransactionQueries do
  @moduledoc """
  Define Transaction queries
  """

  import Ecto.Query, warn: false
  alias Homework.Transactions.Transaction

  def base_query do
    from(t in Transaction)
  end
end
