defmodule Homework.Users.UserTest do
  use Homework.DataCase, async: true

  alias Ecto.Changeset
  alias Homework.Users.User

  @schema_fields ~w(dob first_name last_name company_id)a

  @schema_required_fields ~w(first_name last_name company_id)a

  @vaild_attrs %{
    "company_id" => "2864b299-60ef-4464-bf2b-db53127356de",
    "dob" => "2022-10-15",
    "first_name" => "Mary",
    "last_name" => "Jane"
  }

  describe "changeset/2" do
    test "success: return a valid changeset when given a valid arguments" do
      attrs = @vaild_attrs

      changeset = User.changeset(%User{}, attrs)

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
      not_a_id = DateTime.utc_now()

      attrs = %{
        "company_id" => not_a_id,
        "dob" => not_a_string,
        "first_name" => not_a_string,
        "last_name" => not_a_string
      }

      changeset = User.changeset(%User{}, attrs)

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

      changeset = User.changeset(%User{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      for field <- @schema_required_fields do
        assert errors[field], "The field #{inspect(field)} is missing from errors"

        {_, meta} = errors[field]

        assert meta[:validation] == :required,
               "The validation type, #{meta[:validation]}, is incorrect"
      end
    end

    test "error: return error changeset when dob is not a valid value" do
      attrs = Map.merge(@vaild_attrs, %{"dob" => "2015-01-32"})

      changeset = User.changeset(%User{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      assert errors[:dob], "The field :dob is missing from errors"

      {_, meta} = errors[:dob]

      assert meta[:validation] == :value,
             "The validation type, #{meta[:validation]}, is incorrect"
    end
  end
end
