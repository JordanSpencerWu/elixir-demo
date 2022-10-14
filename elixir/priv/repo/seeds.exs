alias Homework.Companies.Company
alias Homework.Merchants.Merchant
alias Homework.Transactions.Transaction
alias Homework.Users.User

if Mix.env() == :dev do
  num_of_companies = 100
  num_of_users = 50
  num_of_merchants = 50
  num_of_transactions = 100

  defmodule Seeds do
    @moduledoc false
  
    def build_company do
      now = NaiveDateTime.utc_now()
  
      %{
        name: Faker.Company.name(),
        credit_line: :rand.uniform(100_000_000_000),
        inserted_at: NaiveDateTime.truncate(now, :second),
        updated_at: NaiveDateTime.truncate(now, :second)
      }
    end
  
    def build_user(company) do
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
        company_id: user.company_id,
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

  seed_companies =
    for _ <- 1..num_of_companies do
      Seeds.build_company()
    end

  {_count, companies} = Homework.Repo.insert_all(Company, seed_companies, returning: true)

  seed_users =
    for _ <- 1..num_of_users do
      company = Enum.random(companies)
      Seeds.build_user(company)
    end

  {_count, users} = Homework.Repo.insert_all(User, seed_users, returning: true)

  seed_merchants =
    for _ <- 1..num_of_merchants do
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
