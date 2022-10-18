defmodule HomeworkWeb.Schemas.UsersSchemaTest do
  use HomeworkWeb.ConnCase, async: true

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
    query users($filter: UserFilter, $search: UserSearch) {
      users(filter: $filter, search: $search) {
        entries {
          __typename
          ... on User {
            ...UserFields
          }
        }
        offset
        total_rows
      }
    }
    #{@fragment}
    """

    test "success: return empty users query", %{conn: conn} do
      params = %{"query" => @query}

      %{
        "data" => %{
          "users" => %{"entries" => users, "offset" => offset, "total_rows" => total_rows}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert users == []
      assert offset == 0
      assert total_rows == 0
    end

    test "success: return users query", %{conn: conn} do
      num_of_users = 5
      now = DateTime.utc_now() |> DateTime.to_naive()
      Factory.insert_list(num_of_users, :user)
      Factory.insert(:user, deleted_at: now)

      params = %{"query" => @query}

      %{
        "data" => %{
          "users" => %{"entries" => users, "offset" => offset, "total_rows" => total_rows}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(users) == num_of_users
      assert offset == num_of_users
      assert total_rows == num_of_users
    end

    test "success: return users query filtered by company", %{conn: conn} do
      num_of_users = 5
      company = Factory.insert(:company)
      Factory.insert_list(num_of_users, :user, company: company)
      Factory.insert(:user)

      params = %{
        "query" => @query,
        "variables" => %{
          "filter" => %{
            "company_id" => company.id
          }
        }
      }

      %{
        "data" => %{
          "users" => %{"entries" => users, "offset" => offset, "total_rows" => total_rows}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(users) == num_of_users
      assert offset == num_of_users
      assert total_rows == num_of_users
    end

    test "success: return users query when searching by first name for Mary", %{conn: conn} do
      company = Factory.insert(:company)
      Factory.insert(:user, company: company, first_name: "Mary", last_name: "Jane")
      Factory.insert(:user, company: company, first_name: "Marylin", last_name: "Monroe")
      Factory.insert(:user, company: company, first_name: "Peter", last_name: "Parker")

      params = %{
        "query" => @query,
        "variables" => %{
          "search" => %{
            "search_by_first_name" => "Mary"
          }
        }
      }

      %{
        "data" => %{
          "users" => %{"entries" => users}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      user_names = Enum.map(users, & &1["first_name"])

      assert ["Mary", "Marylin"] == user_names
    end

    test "success: return users query when searching by last name for Jane", %{conn: conn} do
      company = Factory.insert(:company)
      Factory.insert(:user, company: company, first_name: "Mary", last_name: "Jane")
      Factory.insert(:user, company: company, first_name: "Marylin", last_name: "Monroe")
      Factory.insert(:user, company: company, first_name: "Peter", last_name: "Parker")

      params = %{
        "query" => @query,
        "variables" => %{
          "search" => %{
            "search_by_last_name" => "Jane"
          }
        }
      }

      %{
        "data" => %{
          "users" => %{"entries" => users}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      user_names = Enum.map(users, & &1["last_name"])

      assert ["Jane"] == user_names
    end
  end

  describe "user query" do
    @query """
    query user($id: ID!) {
      user(id: $id) {
        ...UserFields
      }
    }
    #{@fragment}
    """

    test "success: return user query", %{conn: conn} do
      expected_user = Factory.insert(:user)

      params = %{"query" => @query, "variables" => %{"id" => expected_user.id}}

      %{
        "data" => %{
          "user" => user
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert user["id"] == expected_user.id
      assert user["dob"] == expected_user.dob
      assert user["first_name"] == expected_user.first_name
      assert user["last_name"] == expected_user.last_name
      assert user["company"]["id"] == expected_user.company.id
      assert user["company"]["available_credit"] == "1000000.00"
      assert user["company"]["credit_line"] == "1000000.00"
      assert user["company"]["name"] == expected_user.company.name
    end

    test "success: return nil for deleted user", %{conn: conn} do
      now = DateTime.utc_now() |> DateTime.to_naive()
      expected_user = Factory.insert(:user, deleted_at: now)

      params = %{"query" => @query, "variables" => %{"id" => expected_user.id}}

      %{
        "data" => %{
          "user" => user
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert user == nil
    end

    test "error: return changeset error", %{conn: conn} do
      invalid_user_id = Ecto.UUID.generate()

      params = %{"query" => @query, "variables" => %{"id" => invalid_user_id}}

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["user"]
               }
             ] == errors
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

    test "error: return changeset error", %{conn: conn} do
      company = Factory.insert(:company)
      build_user = Factory.build(:user, company: company)

      params = %{
        "query" => @query,
        "variables" => %{
          "company_id" => company.id,
          "dob" => "2015-01-32",
          "first_name" => build_user.first_name,
          "last_name" => build_user.last_name
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "dob: invalid value",
                 "path" => ["create_user"]
               }
             ] == errors
    end
  end

  describe "update user mutation" do
    @query """
    mutation update_user(
      $id: ID!,
      $company_id: ID,
      $dob: String,
      $first_name: String,
      $last_name: String
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

    test "error: return changeset error", %{conn: conn} do
      user = Factory.insert(:user)
      update_dob = "2015-01-32"

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => user.id,
          "dob" => update_dob
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 8}],
                 "message" => "dob: invalid value",
                 "path" => ["update_user"]
               }
             ] == errors
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_user_id = Ecto.UUID.generate()
      update_dob = Date.utc_today() |> Date.add(1) |> Date.to_iso8601()

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_user_id,
          "dob" => update_dob
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 8}],
                 "message" => "id: invalid value",
                 "path" => ["update_user"]
               }
             ] == errors
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

      user = Repo.get(User, user.id)

      assert user.deleted_at != DateTime.from_unix!(0) |> DateTime.to_naive()
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_user_id = Ecto.UUID.generate()

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_user_id
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["delete_user"]
               }
             ] == errors
    end
  end
end
