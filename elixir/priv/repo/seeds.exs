alias Homework.Merchants.Merchant
alias Homework.Transactions.Transaction
alias Homework.Users.User

defmodule Seeds do
  @moduledoc false

  def build_user do
    now = NaiveDateTime.utc_now()
    start_date = Date.utc_today()
    end_date = Date.new!(1900, 1, 1)
    dob = Faker.Date.between(start_date, end_date)

    %{
      dob: Date.to_iso8601(dob),
      first_name: Faker.Person.first_name(),
      last_name: Faker.Person.last_name(),
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end

  def build_merchant do
    now = NaiveDateTime.utc_now()

    %{
      description: Faker.Company.catch_phrase(),
      name: Faker.Company.name(),
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end

  def build_transaction(user, merchant) do
    now = NaiveDateTime.utc_now()

    %{
      amount: :rand.uniform(100_000_000),
      credit: Enum.random([true, false]),
      debit: Enum.random([true, false]),
      description: Faker.Lorem.Shakespeare.hamlet(),
      merchant_id: merchant.id,
      user_id: user.id,
      inserted_at: NaiveDateTime.truncate(now, :second),
      updated_at: NaiveDateTime.truncate(now, :second)
    }
  end
end

if Mix.env() == :dev do
  num_of_users = 50
  num_of_merchants = 50
  num_of_transactions = 100

  seed_users =
    for _ <- 1..num_of_users do
      Seeds.build_user()
    end

  {_count, users} = Homework.Repo.insert_all(User, seed_users, returning: true)

  seed_merchants =
    for _ <- 1..num_of_users do
      Seeds.build_merchant()
    end

  {_count, merchants} = Homework.Repo.insert_all(Merchant, seed_merchants, returning: true)

  seed_transactions =
    for _ <- 1..num_of_transactions do
      user = Enum.random(users)
      merchant = Enum.random(merchants)

      Seeds.build_transaction(user, merchant)
    end

  Homework.Repo.insert_all(Transaction, seed_transactions)

  Mix.shell().info("The database for Homework.Repo has been seeded")
end
