defmodule Homework.Users.User do
  @moduledoc """
  Ecto schema for User
  """

  use Ecto.Schema
  import Ecto.Changeset
  alias Homework.Companies.Company

  @type t :: %__MODULE__{
          __meta__: Ecto.Schema.Metadata.t(),
          id: Ecto.UUID.t(),
          company_id: Ecto.UUID.t(),
          company: Merchant.t(),
          dob: String.t(),
          first_name: String.t(),
          last_name: String.t(),
          inserted_at: NaiveDateTime.t(),
          updated_at: NaiveDateTime.t()
        }

  @autogenerated_fields ~w(id inserted_at updated_at)a
  @required_fields ~w(first_name last_name company_id)a

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "users" do
    field(:dob, :string)
    field(:first_name, :string)
    field(:last_name, :string)

    belongs_to(:company, Company, type: :binary_id, foreign_key: :company_id)

    timestamps()
  end

  @doc false
  @spec changeset(t, map) :: Ecto.Changeset.t()
  def changeset(user, attrs) do
    user
    |> cast(attrs, all_fields() -- @autogenerated_fields)
    |> validate_required(@required_fields)
    |> validate_dob()
  end

  @spec all_fields :: list(atom)
  defp all_fields, do: __MODULE__.__schema__(:fields)

  @spec validate_dob(Ecto.Changeset.t()) :: Ecto.Changeset.t()
  defp validate_dob(changeset) do
    with dob when not is_nil(dob) <- get_change(changeset, :dob),
         false <- dob_valid?(dob) do
      add_error(changeset, :dob, "invalid value", validation: :value)
    else
      _ -> changeset
    end
  end

  defp dob_valid?(dob) do
    case Date.from_iso8601(dob) do
      {:ok, _} -> true
      {:error, _} -> false
    end
  end
end
