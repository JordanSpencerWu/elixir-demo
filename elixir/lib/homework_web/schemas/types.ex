defmodule HomeworkWeb.Schemas.Types do
  @moduledoc """
  Defines the types for the Schema to use.
  """
  use Absinthe.Schema.Notation

  alias Homework.Companies.Company
  alias Homework.Merchants.Merchant
  alias Homework.Transactions.Transaction
  alias Homework.Users.User

  import_types(Absinthe.Type.Custom)
  import_types(HomeworkWeb.Schemas.Types.Custom)
  import_types(HomeworkWeb.Schemas.CompaniesSchema)
  import_types(HomeworkWeb.Schemas.MerchantsSchema)
  import_types(HomeworkWeb.Schemas.TransactionsSchema)
  import_types(HomeworkWeb.Schemas.UsersSchema)

  object :page_result do
    field(:entries, list_of(:page_entries_result))
    field(:offset, :integer)
    field(:total_rows, :integer)
  end

  union :page_entries_result do
    description("A page entries result")

    types([:company, :merchant, :transaction, :user])

    resolve_type(fn
      %Company{}, _ -> :company
      %Merchant{}, _ -> :merchant
      %Transaction{}, _ -> :transaction
      %User{}, _ -> :user
    end)
  end
end
