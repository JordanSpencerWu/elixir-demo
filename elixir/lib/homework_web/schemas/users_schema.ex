defmodule HomeworkWeb.Schemas.UsersSchema do
  @moduledoc """
  Defines the graphql schema for user.
  """
  use Absinthe.Schema.Notation

  alias HomeworkWeb.Resolvers.UsersResolver

  object :user do
    field(:id, non_null(:id))
    field(:company_id, :id)
    field(:dob, :string)
    field(:first_name, :string)
    field(:inserted_at, :naive_datetime)
    field(:last_name, :string)
    field(:updated_at, :naive_datetime)

    field(:company, :company) do
      resolve(fn user, _args, _info ->
        batch({UsersResolver, :companies_by_id}, user.company_id, fn batch_results ->
          {:ok, Map.get(batch_results, user.company_id)}
        end)
      end)
    end
  end

  object :user_queries do
    @desc "Get all Users"
    field(:users, :page_result) do
      arg(:filter, :user_filter, default_value: %{})
      arg(:limit, :integer, default_value: 10_000)
      arg(:search, :user_search, default_value: %{})
      arg(:skip, :integer, default_value: 0)

      resolve(&UsersResolver.users/3)
    end

    @desc "Get a User"
    field(:user, :user) do
      arg(:id, non_null(:id))

      resolve(&UsersResolver.user/3)
    end
  end

  object :user_mutations do
    @desc "Create a new user"
    field :create_user, :user do
      arg(:company_id, non_null(:id))
      arg(:dob, non_null(:string))
      arg(:first_name, non_null(:string))
      arg(:last_name, non_null(:string))

      resolve(&UsersResolver.create_user/3)
    end

    @desc "Update a new user"
    field :update_user, :user do
      arg(:id, non_null(:id))
      arg(:company_id, :id)
      arg(:dob, :string)
      arg(:first_name, :string)
      arg(:last_name, :string)

      resolve(&UsersResolver.update_user/3)
    end

    @desc "delete an existing user"
    field :delete_user, :user do
      arg(:id, non_null(:id))

      resolve(&UsersResolver.delete_user/3)
    end
  end

  input_object :user_filter do
    field(:company_id, :id)
  end

  input_object :user_search do
    field(:search_by_first_name, :string)
    field(:search_by_last_name, :string)
  end
end
