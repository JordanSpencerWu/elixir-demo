defmodule SeedsFactory do
  @moduledoc false

  alias Homework.Companies.Company
  alias Homework.Merchants.Merchant
  alias Homework.Users.User

  @type transaction_type :: :credit | :debit | :cash

  @spec build_company(integer) :: map
  def build_company(seconds) do
    now = NaiveDateTime.utc_now() |> NaiveDateTime.add(seconds)

    %{
      name: Faker.Company.name(),
      credit_line: :rand.uniform(100_000_000_000),
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end

  @spec build_user(Company.t(), integer) :: map
  def build_user(company, seconds) do
    now = NaiveDateTime.utc_now() |> NaiveDateTime.add(seconds)
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

  @spec build_merchant(integer) :: map
  def build_merchant(seconds) do
    now = NaiveDateTime.utc_now() |> NaiveDateTime.add(seconds)

    %{
      description: Faker.Company.catch_phrase(),
      name: Faker.Company.name(),
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end

  @spec build_transaction(User.t(), Merchant.t(), transaction_type, integer) :: map
  def build_transaction(user, merchant, type, seconds) do
    now = NaiveDateTime.utc_now() |> NaiveDateTime.add(seconds)

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
