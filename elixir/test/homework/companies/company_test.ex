defmodule Homework.Companies.CompanyTest do
  use Homework.DataCase

  alias Ecto.Changeset
  alias Homework.Companies.Company

  @schema_fields ~w(credit_line name)a

  @schema_create_required_fields ~w(credit_line name)a

  @vaild_attrs %{
    "credit_line" => 100_000_000,
    "name" => "Mary Jane Inc."
  }

  describe "changeset/2" do
    test "success: return a valid changeset when given a valid arguments" do
      attrs = @vaild_attrs

      changeset = Company.changeset(%Company{}, attrs)

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
      not_a_integer = DateTime.utc_now()

      attrs = %{
        "credit_line" => not_a_string,
        "name" => not_a_integer
      }

      changeset = Company.changeset(%Company{}, attrs)

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

      changeset = Company.changeset(%Company{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      for field <- @schema_create_required_fields do
        assert errors[field], "The field #{inspect(field)} is missing from errors"

        {_, meta} = errors[field]

        assert meta[:validation] == :required,
               "The validation type, #{meta[:validation]}, is incorrect"
      end
    end

    test "error: return error changeset when credit line is a negative integer" do
      attrs = Map.merge(@vaild_attrs, %{"credit_line" => -100})

      changeset = Company.changeset(%Company{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      {_, meta} = errors[:credit_line]

      assert [validation: :number, kind: :greater_than_or_equal_to, number: 0] == meta,
             "The validation failed for credit_line, must be #{meta[:kind]} to #{meta[:number]}"
    end
  end
end
