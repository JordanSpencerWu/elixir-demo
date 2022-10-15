defmodule Homework.Transactions.TransactionTest do
  use Homework.DataCase

  alias Ecto.Changeset
  alias Homework.Transactions.Transaction

  @schema_fields ~w(amount credit debit description company_id user_id merchant_id)a

  @schema_required_fields ~w(amount description company_id user_id merchant_id)a

  @vaild_attrs %{
    "amount" => 100_000_000,
    "credit" => false,
    "debit" => true,
    "description" =>
      "Mary Jane Watson is a fictional character appearing in American comic books published by Marvel Comics.",
    "company_id" => "2864b299-60ef-4464-bf2b-db53127356de",
    "user_id" => "2864b299-60ef-4464-bf2b-db53127356de",
    "merchant_id" => "2864b299-60ef-4464-bf2b-db53127356de"
  }

  describe "changeset/2" do
    test "success: return a valid changeset when given a valid arguments" do
      attrs = @vaild_attrs

      changeset = Transaction.changeset(%Transaction{}, attrs)

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
      not_a_boolean = DateTime.utc_now()
      not_a_id = DateTime.utc_now()

      attrs = %{
        "amount" => not_a_integer,
        "credit" => not_a_boolean,
        "debit" => not_a_boolean,
        "description" => not_a_string,
        "company_id" => not_a_id,
        "user_id" => not_a_id,
        "merchant_id" => not_a_id
      }

      changeset = Transaction.changeset(%Transaction{}, attrs)

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

      changeset = Transaction.changeset(%Transaction{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      for field <- @schema_required_fields do
        assert errors[field], "The field #{inspect(field)} is missing from errors"

        {_, meta} = errors[field]

        assert meta[:validation] == :required,
               "The validation type, #{meta[:validation]}, is incorrect"
      end
    end

    test "error: return error changeset when transaction is not valid when both debit and credit is false" do
      attrs = Map.merge(@vaild_attrs, %{"credit" => false, "debit" => false})

      changeset = Transaction.changeset(%Transaction{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      assert errors[:credit], "The field :credit is missing from errors"
      assert errors[:debit], "The field :debit is missing from errors"

      {_, meta} = errors[:credit]

      assert meta[:validation] == :value,
             "The validation type, #{meta[:validation]}, is incorrect"

      {_, meta} = errors[:debit]

      assert meta[:validation] == :value,
             "The validation type, #{meta[:validation]}, is incorrect"
    end

    test "error: return error changeset when transaction is not valid when both debit and credit is true" do
      attrs = Map.merge(@vaild_attrs, %{"credit" => true, "debit" => true})

      changeset = Transaction.changeset(%Transaction{}, attrs)

      assert %Changeset{valid?: false, errors: errors} = changeset

      assert errors[:credit], "The field :credit is missing from errors"
      assert errors[:debit], "The field :debit is missing from errors"

      {_, meta} = errors[:credit]

      assert meta[:validation] == :value,
             "The validation type, #{meta[:validation]}, is incorrect"

      {_, meta} = errors[:debit]

      assert meta[:validation] == :value,
             "The validation type, #{meta[:validation]}, is incorrect"
    end
  end
end
