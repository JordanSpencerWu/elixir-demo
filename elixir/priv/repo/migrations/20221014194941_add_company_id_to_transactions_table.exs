defmodule Homework.Repo.Migrations.AddCompanyIdToTransactionsTable do
  use Ecto.Migration

  def change do
    alter table(:transactions) do
      add(:company_id, references(:companies, type: :uuid, on_delete: :nothing), null: false)
      modify(
        :user_id,
        references(:users, type: :uuid, on_delete: :nothing), null: false,
        from: references(:users, type: :uuid, on_delete: :nothing)
      )
      modify(
        :merchant_id,
        references(:merchants, type: :uuid, on_delete: :nothing), null: false,
        from: references(:merchants, type: :uuid, on_delete: :nothing)
      )
    end

    create index(:transactions, [:company_id])
    create index(:transactions, [:user_id])
    create index(:transactions, [:merchant_id])
  end
end
