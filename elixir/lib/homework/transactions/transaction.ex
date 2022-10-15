defmodule Homework.Transactions.Transaction do
  @moduledoc """
  Ecto schema for Transaction
  """

  use Ecto.Schema
  import Ecto.Changeset
  alias Homework.Companies.Company
  alias Homework.Merchants.Merchant
  alias Homework.Users.User

  @type t :: %__MODULE__{
          __meta__: Ecto.Schema.Metadata.t(),
          id: Ecto.UUID.t(),
          amount: integer,
          company_id: Ecto.UUID.t(),
          company: Merchant.t(),
          credit: boolean,
          debit: boolean,
          description: String.t(),
          merchant_id: Ecto.UUID.t(),
          merchant: Merchant.t(),
          user_id: Ecto.UUID.t(),
          user: User.t(),
          inserted_at: NaiveDateTime.t(),
          updated_at: NaiveDateTime.t()
        }

  @autogenerated_fields ~w(id inserted_at updated_at)a
  @required_fields ~w(amount credit debit description company_id user_id merchant_id)a

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "transactions" do
    field(:amount, :integer)
    field(:credit, :boolean, default: false)
    field(:debit, :boolean, default: false)
    field(:description, :string)

    belongs_to(:company, Company, type: :binary_id, foreign_key: :company_id)
    belongs_to(:merchant, Merchant, type: :binary_id, foreign_key: :merchant_id)
    belongs_to(:user, User, type: :binary_id, foreign_key: :user_id)

    timestamps()
  end

  @doc false
  @spec changeset(t, map) :: Ecto.Changeset.t()
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, all_fields() -- @autogenerated_fields)
    |> validate_required(@required_fields)
  end

  @spec all_fields :: list(atom)
  defp all_fields, do: __MODULE__.__schema__(:fields)
end
