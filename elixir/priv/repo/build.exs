defmodule Build do
  @moduledoc false

  alias Homework.Companies.Company
  alias Homework.Merchants.Merchant
  alias Homework.Users.User

  @type transaction_type :: :credit | :debit | :cash

  @spec company_entry() :: map
  def company_entry do
    now = NaiveDateTime.utc_now()

    %{
      name: Faker.Company.name(),
      credit_line: :rand.uniform(100_000_000_000),
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end

  @spec user_entry(Company.t()) :: map
  def user_entry(company) do
    now = NaiveDateTime.utc_now()
    start_date = Date.utc_today()
    end_date = Date.new!(1900, 1, 1)
    dob = Faker.Date.between(start_date, end_date)

    %{
      company_id: company.id,
      dob: Date.to_iso8601(dob),
      first_name: Faker.Person.first_name(),
      last_name: Faker.Person.last_name(),
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end

  @spec merchant_entry() :: map
  def merchant_entry do
    now = NaiveDateTime.utc_now()

    %{
      description: Faker.Company.catch_phrase(),
      name: Faker.Company.name(),
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end

  @spec transaction_entry(User.t(), Merchant.t(), transaction_type) :: map
  def transaction_entry(user, merchant, type \\ :credit) do
    now = NaiveDateTime.utc_now()

    credit_transaction = %{
      amount: :rand.uniform(100_000_000),
      company_id: user.company_id,
      credit: true,
      debit: false,
      description: Faker.Lorem.Shakespeare.hamlet(),
      merchant_id: merchant.id,
      user_id: user.id,
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }

    case type do
      :credit -> credit_transaction
      :debit -> %{credit_transaction | credit: false, debit: true}
      :cash -> %{credit_transaction | credit: false, debit: false}
    end
  end
end
