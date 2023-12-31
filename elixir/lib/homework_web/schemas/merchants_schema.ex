defmodule HomeworkWeb.Schemas.MerchantsSchema do
  @moduledoc """
  Defines the graphql schema for merchants.
  """
  use Absinthe.Schema.Notation

  alias HomeworkWeb.Resolvers.MerchantsResolver

  object :merchant do
    field(:id, non_null(:id))
    field(:description, :string)
    field(:inserted_at, :naive_datetime)
    field(:name, :string)
    field(:updated_at, :naive_datetime)

    field(:deleted, :boolean) do
      resolve(fn merchant, _args, _info ->
        epoch = DateTime.from_unix!(0) |> DateTime.to_naive()
        deleted = merchant.deleted_at != epoch

        {:ok, deleted}
      end)
    end
  end

  object :merchant_queries do
    @desc "Get all Merchants"
    field(:merchants, :page_result) do
      arg(:limit, :integer, default_value: 10_000)
      arg(:search, :merchant_search, default_value: %{})
      arg(:skip, :integer, default_value: 0)

      resolve(&MerchantsResolver.merchants/3)
    end

    @desc "Get a Merchant"
    field(:merchant, :merchant) do
      arg(:id, non_null(:id))

      resolve(&MerchantsResolver.merchant/3)
    end
  end

  object :merchant_mutations do
    @desc "Create a new merchant"
    field :create_merchant, :merchant do
      arg(:name, non_null(:string))
      arg(:description, non_null(:string))

      resolve(&MerchantsResolver.create_merchant/3)
    end

    @desc "Update a new merchant"
    field :update_merchant, :merchant do
      arg(:id, non_null(:id))
      arg(:name, :string)
      arg(:description, :string)

      resolve(&MerchantsResolver.update_merchant/3)
    end

    @desc "delete an existing merchant"
    field :delete_merchant, :merchant do
      arg(:id, non_null(:id))

      resolve(&MerchantsResolver.delete_merchant/3)
    end
  end

  input_object :merchant_search do
    field(:search_by_name, :string)
  end
end
