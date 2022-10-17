defmodule HomeworkWeb.Schemas.Types.CustomTest do
  use ExUnit.Case, async: true

  alias Absinthe.Type
  alias Absinthe.Blueprint.Input

  defmodule TestSchema do
    use Absinthe.Schema
    import_types(HomeworkWeb.Schemas.Types.Custom)

    query do
      field(:foo, :string)
    end
  end

  defp serialize(type, value) do
    TestSchema.__absinthe_type__(type)
    |> Type.Scalar.serialize(value)
  end

  defp parse(type, value) do
    TestSchema.__absinthe_type__(type)
    |> Type.Scalar.parse(value)
  end

  describe ":decimal_amount" do
    test "serializes as a integer" do
      assert "0.01" == serialize(:decimal_amount, 1)
      assert "0.10" == serialize(:decimal_amount, 10)
      assert "1.00" == serialize(:decimal_amount, 100)
      assert "10.00" == serialize(:decimal_amount, 1000)
      assert "12.34" == serialize(:decimal_amount, 1234)

      assert "-0.01" == serialize(:decimal_amount, -1)
      assert "-0.10" == serialize(:decimal_amount, -10)
      assert "-1.00" == serialize(:decimal_amount, -100)
      assert "-10.00" == serialize(:decimal_amount, -1000)
      assert "-12.34" == serialize(:decimal_amount, -1234)
    end

    test "can be parsed from a null" do
      assert {:ok, nil} = parse(:decimal_amount, %Input.Null{})
    end

    test "can be parsed from a numeric string" do
      assert {:ok, decimal_amount} = parse(:decimal_amount, %Input.String{value: "-3.49"})
      assert decimal_amount == -349
    end

    test "can be parsed from a float" do
      assert {:ok, decimal_amount} = parse(:decimal_amount, %Input.Float{value: -3.49})
      assert decimal_amount == -349
    end

    test "cannot be parsed from an integer" do
      assert :error = parse(:decimal_amount, %Input.Integer{value: 3})
    end

    test "cannot be parsed from alphanumeric string" do
      assert :error == parse(:decimal_amount, %Input.String{value: "23.4 abc"})
    end
  end
end
