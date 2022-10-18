defmodule Homework.Repo.Migrations.AddDeletedAtColumnsToTables do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:deleted_at, :naive_datetime, null: false, default: fragment("to_timestamp(0)"))
    end

    alter table(:merchants) do
      add(:deleted_at, :naive_datetime, null: false, default: fragment("to_timestamp(0)"))
    end

    alter table(:transactions) do
      add(:deleted_at, :naive_datetime, null: false, default: fragment("to_timestamp(0)"))
    end

    alter table(:companies) do
      add(:deleted_at, :naive_datetime, null: false, default: fragment("to_timestamp(0)"))
    end
  end
end
