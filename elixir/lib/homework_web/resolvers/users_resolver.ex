defmodule HomeworkWeb.Resolvers.UsersResolver do
  @moduledoc """
  The Resolver for Users
  """

  alias Homework.Companies
  alias Homework.Paginator
  alias Homework.Users

  @doc """
  Get a list of users
  """
  def users(_root, args, _info) do
    criteria = Map.merge(args.filter, args.search)
    users = Users.list_users(criteria)
    opts = args |> Map.take([:limit, :skip]) |> Enum.into([])

    Paginator.paginate(users, opts)
  end

  @doc """
  Get a user
  """
  def user(_root, args, _info) do
    user = Users.get_user!(args.id)

    {:ok, user}
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end

  @doc """
  Get the company associated with a user
  """
  def companies_by_id(_args, company_ids) do
    companies = Companies.list_companies(%{ids: company_ids})
    Map.new(companies, fn company -> {company.id, company} end)
  end

  @doc """
  Creates a user
  """
  def create_user(_root, args, _info) do
    Users.create_user(args)
  end

  @doc """
  Updates a user for an id with args specified.
  """
  def update_user(_root, %{id: id} = args, _info) do
    user = Users.get_user!(id)

    Users.update_user(user, args)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end

  @doc """
  Deletes a user for an id
  """
  def delete_user(_root, %{id: id}, _info) do
    user = Users.get_user!(id)

    Users.delete_user(user)
  rescue
    _e in Ecto.NoResultsError -> {:error, "id: invalid value"}
  end
end
