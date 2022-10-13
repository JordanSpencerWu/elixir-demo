defmodule HomeworkWeb.Schema do
  @moduledoc """
  Defines the graphql schema for this project.
  """
  use Absinthe.Schema

  alias HomeworkWeb.Resolvers.MerchantsResolver
  alias HomeworkWeb.Resolvers.TransactionsResolver
  alias HomeworkWeb.Resolvers.UsersResolver
  import_types(HomeworkWeb.Schemas.Types)

  query do
    import_fields(:merchant_queries)
    import_fields(:transaction_queries)
    import_fields(:user_queries)
  end

  mutation do
    import_fields(:merchant_mutations)
    import_fields(:transaction_mutations)
    import_fields(:user_mutations)
  end
end
