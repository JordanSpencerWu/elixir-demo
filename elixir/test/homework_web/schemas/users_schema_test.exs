defmodule HomeworkWeb.Schemas.UsersSchemaTest do
  use HomeworkWeb.ConnCase

  alias Homework.Factory

  @company_fragment """
  fragment CompanyFields on Company {
    id
    available_credit
    name
    credit_line
    inserted_at
    updated_at
  }
  """

  @fragment """
    fragment UserFields on User {
      id
      dob
      first_name
      last_name
      inserted_at
      updated_at
      company {
        ...CompanyFields
      }
    }
    #{@company_fragment}
  """

  describe "users query" do
    @query """
    query {
      users {
        ...UserFields
      }
    }
    #{@fragment}
    """

    test "success: return empty users query", %{conn: conn} do
      params = %{"query" => @query}

      %{"data" => %{"users" => users}} = conn |> post("/graphql", params) |> json_response(200)

      assert users == []
    end

    test "success: return users query", %{conn: conn} do
      num_of_users = 5
      Factory.insert_list(num_of_users, :user)
      params = %{"query" => @query}

      %{"data" => %{"users" => users}} = conn |> post("/graphql", params) |> json_response(200)

      assert length(users) == num_of_users
    end
  end

  describe "create user mutation" do
    @query """
    mutation create_user($company_id: ID!, $dob: String!, $first_name: String!, $last_name: String!) {
      create_user(company_id: $company_id, dob: $dob, first_name: $first_name, last_name: $last_name) {
        ...UserFields
      }
    }
    #{@fragment}
    """

    test "success: return create user mutation", %{conn: conn} do
      company = Factory.insert(:company)
      build_user = Factory.build(:user, company: company)

      params = %{
        "query" => @query,
        "variables" => %{
          "company_id" => company.id,
          "dob" => build_user.dob,
          "first_name" => build_user.first_name,
          "last_name" => build_user.last_name
        }
      }

      %{"data" => %{"create_user" => create_user}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert create_user["id"]
      assert create_user["inserted_at"]
      assert create_user["updated_at"]
      assert create_user["dob"] == build_user.dob
      assert create_user["first_name"] == build_user.first_name
      assert create_user["last_name"] == build_user.last_name
      assert create_user["company"]["id"] == company.id
      assert create_user["company"]["available_credit"] == "1000000.00"
      assert create_user["company"]["credit_line"] == "1000000.00"
      assert create_user["company"]["name"] == company.name
    end
  end

  describe "update user mutation" do
    @query """
    mutation update_user(
      $id: ID!,
      $company_id: ID!,
      $dob: String!,
      $first_name: String!,
      $last_name: String!
    ) {
      update_user(
        id: $id,
        company_id: $company_id,
        dob: $dob,
        first_name: $first_name,
        last_name: $last_name
      ) {
        ...UserFields
      }
    }
    #{@fragment}
    """

    test "success: return update user mutation", %{conn: conn} do
      user = Factory.insert(:user)

      update_company = Factory.insert(:company, credit_line: 100_000, name: "update company name")
      update_dob = Date.utc_today() |> Date.add(1) |> Date.to_iso8601()
      update_first_name = "Mary"
      update_last_name = "Jane"

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => user.id,
          "company_id" => update_company.id,
          "dob" => update_dob,
          "first_name" => update_first_name,
          "last_name" => update_last_name
        }
      }

      %{"data" => %{"update_user" => update_user}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert update_user["id"] == user.id
      assert update_user["dob"] == update_dob
      assert update_user["first_name"] == update_first_name
      assert update_user["last_name"] == update_last_name
      assert update_user["company"]["id"] == update_company.id
      assert update_user["company"]["available_credit"] == "1000.00"
      assert update_user["company"]["credit_line"] == "1000.00"
      assert update_user["company"]["name"] == update_company.name
    end
  end

  describe "delete user mutation" do
    alias Homework.Repo
    alias Homework.Users.User

    @query """
    mutation delete_user($id: ID!) {
      delete_user(id: $id) {
        ...UserFields
      }
    }
    #{@fragment}
    """

    test "success: return delete user mutation", %{conn: conn} do
      user = Factory.insert(:user)

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => user.id
        }
      }

      %{"data" => %{"delete_user" => delete_user}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert delete_user["id"] == user.id
      refute Repo.get(User, user.id)
    end
  end
end
