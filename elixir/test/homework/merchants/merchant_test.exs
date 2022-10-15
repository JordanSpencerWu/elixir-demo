defmodule Homework.Merchants.MerchantTest do
  use Homework.DataCase

  alias Ecto.Changeset
  alias Homework.Merchants.Merchant

  @schema_fields ~w(description name)a

  @schema_required_fields ~w(description name)a

  @vaild_attrs %{
    "description" =>
      "Mary Jane Watson is a fictional character appearing in American comic books published by Marvel Comics.",
    "name" => "Mary Jane"
  }

  describe "changeset/2" do
    test "success: return a valid changeset when given a valid arguments" do
      attrs = @vaild_attrs

      changeset = Merchant.changeset(%Merchant{}, attrs)

      assert %Changeset{valid?: true, changes: changes} = changeset

      for field <- @schema_fields do
        actual = changes[field]
        expected = attrs[Atom.to_string(field)]

        assert actual == expected,
               "Values did not match for field: #{field}\nexpected: #{inspect(expected)}\nactual: #{inspect(actual)}"
      end
    end

    test "error: return an error changeset when given un-castable values" do
      not_a_string = DateTime.utc_now()

      attrs = %{
        "description" => not_a_string,
        "name" => not_a_string
      }

      changeset = Merchant.changeset(%Merchant{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      for field <- @schema_fields do
        assert errors[field], "Expected an error for #{field}"
        {_, meta} = errors[field]

        assert meta[:validation] == :cast,
               "The validation type, #{meta[:validation]}, is incorrect"
      end
    end

    test "error: return error changeset when required fields are missing" do
      attrs = %{}

      changeset = Merchant.changeset(%Merchant{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      for field <- @schema_required_fields do
        assert errors[field], "The field #{inspect(field)} is missing from errors"

        {_, meta} = errors[field]

        assert meta[:validation] == :required,
               "The validation type, #{meta[:validation]}, is incorrect"
      end
    end
  end
end
