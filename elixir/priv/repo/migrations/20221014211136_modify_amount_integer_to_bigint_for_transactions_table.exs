defmodule Homework.Repo.Migrations.ModifyAmountIntegerToBigintForTransactionsTable do
  use Ecto.Migration

  def change do
    alter table(:transactions) do
      modify(:amount, :bigint, from: :integer)
    end
  end
end
