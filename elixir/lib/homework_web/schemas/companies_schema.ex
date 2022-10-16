defmodule HomeworkWeb.Schemas.CompaniesSchema do
  @moduledoc """
  Defines the graphql schema for companies.
  """
  use Absinthe.Schema.Notation

  alias HomeworkWeb.Resolvers.CompaniesResolver

  object :company do
    field(:id, non_null(:id))
    field(:credit_line, :decimal_amount)
    field(:inserted_at, :naive_datetime)
    field(:name, :string)
    field(:updated_at, :naive_datetime)

    field(:available_credit, :decimal_amount) do
      resolve(fn company, _args, _info ->
        batch(
          {CompaniesResolver, :available_credit_by_companies_by_ids},
          company.id,
          fn batch_results ->
            {:ok, Map.get(batch_results, company.id)}
          end
        )
      end)
    end
  end

  object :company_queries do
    @desc "Get all Companies"
    field(:companies, :page_result) do
      arg(:limit, :integer, default_value: 50)
      arg(:skip, :integer, default_value: 0)

      resolve(&CompaniesResolver.companies/3)
    end
  end

  object :company_mutations do
    @desc "Create a new company"
    field :create_company, :company do
      arg(:credit_line, non_null(:decimal_amount))
      arg(:name, non_null(:string))

      resolve(&CompaniesResolver.create_company/3)
    end

    @desc "Update a new company"
    field :update_company, :company do
      arg(:id, non_null(:id))
      arg(:credit_line, non_null(:decimal_amount))
      arg(:name, non_null(:string))

      resolve(&CompaniesResolver.update_company/3)
    end

    @desc "delete an existing company"
    field :delete_company, :company do
      arg(:id, non_null(:id))

      resolve(&CompaniesResolver.delete_company/3)
    end
  end
end
