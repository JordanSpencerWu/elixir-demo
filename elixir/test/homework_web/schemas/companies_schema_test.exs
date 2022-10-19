defmodule HomeworkWeb.Schemas.CompaniesSchemaTest do
  use HomeworkWeb.ConnCase, async: true

  alias Homework.Factory

  @fragment """
  fragment CompanyFields on Company {
    id
    available_credit
    name
    credit_line
    inserted_at
    updated_at
  }
  """

  describe "companies query" do
    @query """
    query companies($search: CompanySearch){
      companies(search: $search) {
        entries {
          __typename
          ... on Company {
            ...CompanyFields
          }
        }
        offset
        total_rows
      }
    }
    #{@fragment}
    """

    test "success: return empty companies query", %{conn: conn} do
      params = %{"query" => @query}

      %{
        "data" => %{
          "companies" => %{"entries" => companies, "offset" => offset, "total_rows" => total_rows}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert companies == []
      assert offset == 0
      assert total_rows == 0
    end

    test "success: return companies query", %{conn: conn} do
      num_of_companies = 5
      now = DateTime.utc_now() |> DateTime.to_naive()
      Factory.insert_list(num_of_companies, :company)
      Factory.insert(:company, deleted_at: now)

      params = %{"query" => @query}

      %{
        "data" => %{
          "companies" => %{"entries" => companies, "offset" => offset, "total_rows" => total_rows}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(companies) == num_of_companies
      assert offset == num_of_companies
      assert total_rows == num_of_companies
    end

    test "success: return companies query when searching by name for Mary", %{conn: conn} do
      Factory.insert(:company, name: "Mary Jane")
      Factory.insert(:company, name: "Mary Poppins")
      Factory.insert(:company, name: "Marylin Monroe")
      Factory.insert(:company, name: "Miley Cyrus")
      Factory.insert(:company, name: "Peter Parker")

      params = %{
        "query" => @query,
        "variables" => %{
          "search" => %{
            "search_by_name" => "Mary"
          }
        }
      }

      %{
        "data" => %{
          "companies" => %{"entries" => companies}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      company_names = Enum.map(companies, & &1["name"])

      assert ["Mary Jane", "Mary Poppins", "Marylin Monroe"] == company_names
    end

    test "success: return companies query with correct available_credit", %{conn: conn} do
      merchant = Factory.insert(:merchant)
      company = Factory.insert(:company, credit_line: 100_000)
      user = Factory.insert(:user, company: company)

      _credit_transaction =
        Factory.insert(:transaction,
          company: company,
          merchant: merchant,
          user: user,
          debit: false,
          credit: true,
          amount: 100
        )

      _debit_transaction =
        Factory.insert(:transaction,
          company: company,
          merchant: merchant,
          user: user,
          debit: true,
          credit: false,
          amount: 100
        )

      _cash_transaction =
        Factory.insert(:transaction,
          company: company,
          merchant: merchant,
          user: user,
          debit: false,
          credit: false,
          amount: 100
        )

      params = %{"query" => @query}

      %{
        "data" => %{
          "companies" => %{"entries" => [company]}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert company["available_credit"] == "999.00"
    end
  end

  describe "company query" do
    @query """
    query company($id: ID!) {
      company(id: $id) {
        ...CompanyFields
      }
    }
    #{@fragment}
    """

    test "success: return company query", %{conn: conn} do
      expected_company = Factory.insert(:company)

      params = %{"query" => @query, "variables" => %{"id" => expected_company.id}}

      %{
        "data" => %{
          "company" => company
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert company["id"] == expected_company.id
      assert company["available_credit"] == "1000000.00"
      assert company["credit_line"] == "1000000.00"
      assert company["name"] == expected_company.name
    end

    test "success: return nil for deleted company", %{conn: conn} do
      now = DateTime.utc_now() |> DateTime.to_naive()
      expected_company = Factory.insert(:company, deleted_at: now)

      params = %{"query" => @query, "variables" => %{"id" => expected_company.id}}

      %{
        "data" => %{
          "company" => company
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert company == nil
    end

    test "error: return changeset error", %{conn: conn} do
      invalid_company_id = Ecto.UUID.generate()

      params = %{"query" => @query, "variables" => %{"id" => invalid_company_id}}

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["company"]
               }
             ] == errors
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
      assert create_company["available_credit"] == credit_line
      assert create_company["credit_line"] == credit_line
      assert create_company["name"] == build_company.name
    end
  end

  describe "update company mutation" do
    @query """
    mutation update_company($id: ID!, $credit_line: DecimalAmount, $name: String) {
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
      assert update_company["available_credit"] == update_credit_line
      assert update_company["credit_line"] == update_credit_line
      assert update_company["name"] == update_name
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_company_id = Ecto.UUID.generate()

      update_credit_line = "100000.00"
      update_name = "Mary Jane Inc"

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_company_id,
          "credit_line" => update_credit_line,
          "name" => update_name
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["update_company"]
               }
             ] == errors
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

      company = Repo.get(Company, company.id)
      assert company.deleted_at != DateTime.from_unix!(0) |> DateTime.to_naive()
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_company_id = Ecto.UUID.generate()

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_company_id
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["delete_company"]
               }
             ] == errors
    end
  end
end
