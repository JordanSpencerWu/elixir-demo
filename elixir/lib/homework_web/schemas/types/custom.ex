defmodule HomeworkWeb.Schemas.Types.Custom do
  use Absinthe.Schema.Notation

  @moduledoc """
  This module contains the following additional data types:
  - decimal_amount (only if [Decimal](https://hex.pm/packages/decimal) is available)

  To use: `import_types HomeworkWeb.Schemas.Types.Custom`.
  """

  if Code.ensure_loaded?(Decimal) do
    scalar :decimal_amount do
      description("""
      The `Decimal Amount` scalar type represents signed double-precision fractional
      values parsed by the `Decimal` library.  The Decimal Amount appears in a JSON
      response as a string to preserve precision
      """)

      serialize(&serialize_decimal_amount/1)
      parse(&parse_decimal_amount/1)
    end
  end

  @spec serialize_decimal_amount(integer) :: {:ok, String.t()} | :error
  defp serialize_decimal_amount(value) when is_integer(value) do
    decimal = Decimal.new(value)

    if Decimal.positive?(decimal) do
      decimal = do_serialize_decimal_amount(decimal)
      Decimal.to_string(decimal)
    else
      decimal = decimal |> Decimal.abs() |> do_serialize_decimal_amount()

      decimal |> Decimal.mult(-1) |> Decimal.to_string()
    end
  end

  defp serialize_decimal_amount(_value) do
    :error
  end

  @spec do_serialize_decimal_amount(Decimal.t()) :: float
  defp do_serialize_decimal_amount(decimal) do
    decimal_string = Decimal.to_string(decimal)
    length = String.length(decimal_string)

    decimal_string =
      case length do
        1 ->
          ".0" <> String.at(decimal_string, 0)

        2 ->
          "." <> decimal_string

        _ ->
          {decimal_string, fractional_string} = String.split_at(decimal_string, -2)
          decimal_string <> "." <> fractional_string
      end

    decimal_string
    |> Decimal.new()
  end

  @spec parse_decimal_amount(Absinthe.Blueprint.Input.String.t()) :: {:ok, integer} | :error
  @spec parse_decimal_amount(Absinthe.Blueprint.Input.Float.t()) :: {:ok, integer} | :error
  @spec parse_decimal_amount(Absinthe.Blueprint.Input.Null.t()) :: {:ok, nil}
  defp parse_decimal_amount(%Absinthe.Blueprint.Input.String{value: value}) do
    decimal_amount = value |> Decimal.new() |> Decimal.mult(100) |> Decimal.to_integer()
    {:ok, decimal_amount}
  rescue
    _error -> :error
  end

  defp parse_decimal_amount(%Absinthe.Blueprint.Input.Float{value: value}) do
    decimal_amount =
      value
      |> Decimal.from_float()
      |> Decimal.mult(100)
      |> Decimal.to_integer()

    {:ok, decimal_amount}
  end

  defp parse_decimal_amount(%Absinthe.Blueprint.Input.Null{}) do
    {:ok, nil}
  end

  defp parse_decimal_amount(_value) do
    :error
  end
end
