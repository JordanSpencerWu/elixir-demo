defmodule HomeworkWeb.Schemas.MerchantsSchemaTest do
  use HomeworkWeb.ConnCase, async: true

  alias Homework.Factory

  @fragment """
  fragment MerchantFields on Merchant {
    id
    deleted
    description
    name
    inserted_at
    updated_at
  }
  """

  describe "merchants query" do
    @query """
    query merchants($search: MerchantSearch) {
      merchants(search: $search) {
        entries {
          __typename
          ... on Merchant {
            ...MerchantFields
          }
        }
        offset
        total_rows
      }
    }
    #{@fragment}
    """

    test "success: return empty merchants query", %{conn: conn} do
      params = %{"query" => @query}

      %{
        "data" => %{
          "merchants" => %{"entries" => merchants, "offset" => offset, "total_rows" => total_rows}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert merchants == []
      assert offset == 0
      assert total_rows == 0
    end

    test "success: return merchants query", %{conn: conn} do
      num_of_merchants = 5
      now = DateTime.utc_now() |> DateTime.to_naive()
      Factory.insert_list(num_of_merchants, :merchant)
      Factory.insert(:merchant, deleted_at: now)

      params = %{"query" => @query}

      %{
        "data" => %{
          "merchants" => %{"entries" => merchants, "offset" => offset, "total_rows" => total_rows}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert length(merchants) == num_of_merchants
      assert offset == num_of_merchants
      assert total_rows == num_of_merchants
    end

    test "success: return merchants query when searching by name for Mary", %{conn: conn} do
      Factory.insert(:merchant, name: "Mary Jane")
      Factory.insert(:merchant, name: "Mary Poppins")
      Factory.insert(:merchant, name: "Marylin Monroe")
      Factory.insert(:merchant, name: "Miley Cyrus")
      Factory.insert(:merchant, name: "Peter Parker")

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
          "merchants" => %{"entries" => merchants}
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      merchant_names = Enum.map(merchants, & &1["name"])

      assert ["Mary Jane", "Mary Poppins", "Marylin Monroe"] == merchant_names
    end
  end

  describe "merchant query" do
    @query """
    query merchant($id: ID!) {
      merchant(id: $id) {
        ...MerchantFields
      }
    }
    #{@fragment}
    """

    test "success: return merchant query", %{conn: conn} do
      expected_merchant = Factory.insert(:merchant)
      params = %{"query" => @query, "variables" => %{"id" => expected_merchant.id}}

      %{
        "data" => %{
          "merchant" => merchant
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert merchant["id"] == expected_merchant.id
      assert merchant["deleted"] == false
      assert merchant["description"] == expected_merchant.description
      assert merchant["name"] == expected_merchant.name
    end

    test "success: return deleted merchant with deleted as true", %{conn: conn} do
      now = DateTime.utc_now() |> DateTime.to_naive()
      expected_merchant = Factory.insert(:merchant, deleted_at: now)
      params = %{"query" => @query, "variables" => %{"id" => expected_merchant.id}}

      %{
        "data" => %{
          "merchant" => merchant
        }
      } = conn |> post("/graphql", params) |> json_response(200)

      assert merchant["deleted"]
    end

    test "error: return changeset error", %{conn: conn} do
      invalid_merchant_id = Ecto.UUID.generate()
      params = %{"query" => @query, "variables" => %{"id" => invalid_merchant_id}}

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["merchant"]
               }
             ] == errors
    end
  end

  describe "create merchant mutation" do
    @query """
    mutation create_merchant($name: String!, $description: String!) {
      create_merchant(name: $name, description: $description) {
        ...MerchantFields
      }
    }
    #{@fragment}
    """

    test "success: return create merchant mutation", %{conn: conn} do
      build_merchant = Factory.build(:merchant)

      params = %{
        "query" => @query,
        "variables" => %{
          "name" => build_merchant.name,
          "description" => build_merchant.description
        }
      }

      %{"data" => %{"create_merchant" => create_merchant}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert create_merchant["id"]
      assert create_merchant["inserted_at"]
      assert create_merchant["updated_at"]
      assert create_merchant["deleted"] == false
      assert create_merchant["description"] == build_merchant.description
      assert create_merchant["name"] == build_merchant.name
    end
  end

  describe "update merchant mutation" do
    @query """
    mutation update_merchant($id: ID!, $name: String, $description: String) {
      update_merchant(id: $id, name: $name, description: $description) {
        ...MerchantFields
      }
    }
    #{@fragment}
    """

    test "success: return update merchant mutation", %{conn: conn} do
      merchant = Factory.insert(:merchant)

      update_name = "Mary Jane"

      update_description =
        "Mary Jane Watson is a fictional character appearing in American comic books published by Marvel Comics."

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => merchant.id,
          "name" => update_name,
          "description" => update_description
        }
      }

      %{"data" => %{"update_merchant" => update_merchant}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert update_merchant["id"] == merchant.id
      assert update_merchant["deleted"] == false
      assert update_merchant["description"] == update_description
      assert update_merchant["name"] == update_name
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_merchant_id = Ecto.UUID.generate()

      update_name = "Mary Jane"

      update_description =
        "Mary Jane Watson is a fictional character appearing in American comic books published by Marvel Comics."

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_merchant_id,
          "name" => update_name,
          "description" => update_description
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["update_merchant"]
               }
             ] == errors
    end
  end

  describe "delete merchant mutation" do
    alias Homework.Repo
    alias Homework.Merchants.Merchant

    @query """
    mutation delete_merchant($id: ID!) {
      delete_merchant(id: $id) {
        ...MerchantFields
      }
    }
    #{@fragment}
    """

    test "success: return delete merchant mutation", %{conn: conn} do
      merchant = Factory.insert(:merchant)

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => merchant.id
        }
      }

      %{"data" => %{"delete_merchant" => delete_merchant}} =
        conn |> post("/graphql", params) |> json_response(200)

      assert delete_merchant["id"] == merchant.id

      merchant = Repo.get(Merchant, merchant.id)
      assert merchant.deleted_at != DateTime.from_unix!(0) |> DateTime.to_naive()
    end

    test "error: return error message id is invalid", %{conn: conn} do
      invalid_merchant_id = Ecto.UUID.generate()

      params = %{
        "query" => @query,
        "variables" => %{
          "id" => invalid_merchant_id
        }
      }

      %{"errors" => errors} = conn |> post("/graphql", params) |> json_response(200)

      assert [
               %{
                 "locations" => [%{"column" => 3, "line" => 2}],
                 "message" => "id: invalid value",
                 "path" => ["delete_merchant"]
               }
             ] == errors
    end
  end
end
