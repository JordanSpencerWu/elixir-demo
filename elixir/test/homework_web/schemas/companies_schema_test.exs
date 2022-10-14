defmodule HomeworkWeb.Schemas.CompaniesSchemaTest do
  use HomeworkWeb.ConnCase

  alias Homework.Factory

  @fragment """
  fragment CompanyFields on Company {
    id
    name
    credit_line
    inserted_at
    updated_at
  }
  """

  describe "companies query" do
    @query """
    query {
      companies {
        ...CompanyFields
      }
    }
    #{@fragment}
    """

    test "success: return empty companies query", %{conn: conn} do
      params = %{"query" => @query}

      %{"data" => %{"companies" => companies}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert companies == []
    end

    test "success: return companies query", %{conn: conn} do
      num_of_companies = 5
      Factory.insert_list(num_of_companies, :company)
      params = %{"query" => @query}

      %{"data" => %{"companies" => companies}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert length(companies) == num_of_companies
    end
  end

  describe "create company mutation" do
    @query """
    mutation create_company($credit_line: DecimalAmount!, $name: String!) {
      create_company(credit_line: $credit_line, name: $name) {
        ...CompanyFields
      }
    }
    #{@fragment}
    """

    test "success: return create company mutation", %{conn: conn} do
      build_company = Factory.build(:company)

      credit_line = "100000000.00"

      params = %{
        "query" => @query,
        "variables" => %{
          "credit_line" => credit_line,
          "name" => build_company.name
        }
      }

      %{"data" => %{"create_company" => create_company}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert create_company["id"]
      assert create_company["inserted_at"]
      assert create_company["updated_at"]
      assert create_company["credit_line"] == credit_line
      assert create_company["name"] == build_company.name
    end
  end

  describe "update company mutation" do
    @query """
    mutation update_company($id: ID!, $credit_line: DecimalAmount!, $name: String!) {
      update_company(id: $id, credit_line: $credit_line, name: $name) {
        ...CompanyFields
      }
    }
    #{@fragment}
    """

    test "success: return update company mutation", %{conn: conn} do
      company = Factory.insert(:company)

      update_credit_line = "100000.00"
      update_name = "Mary Jane Inc"

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => company.id,
          "credit_line" => update_credit_line,
          "name" => update_name
        }
      }

      %{"data" => %{"update_company" => update_company}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert update_company["id"] == company.id
      assert update_company["credit_line"] == update_credit_line
      assert update_company["name"] == update_name
    end
  end

  describe "delete company mutation" do
    alias Homework.Repo
    alias Homework.Companies.Company

    @query """
    mutation delete_company($id: ID!) {
      delete_company(id: $id) {
        ...CompanyFields
      }
    }
    #{@fragment}
    """

    test "success: return delete company mutation", %{conn: conn} do
      company = Factory.insert(:company)

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => company.id
        }
      }

      %{"data" => %{"delete_company" => delete_company}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert delete_company["id"] == company.id
      refute Repo.get(Company, company.id)
    end
  end
end