defmodule Homework.Repo.Migrations.AddCompanyIdToUsersTable do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:company_id, references(:companies, type: :uuid, on_delete: :nothing), null: false)
    end

    create index(:users, [:company_id])
  end
end
