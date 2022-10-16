alias Homework.Companies.Company
alias Homework.Merchants.Merchant
alias Homework.Transactions.Transaction
alias Homework.Users.User

if Mix.env() == :dev do
  [{Build, _}] = Code.require_file("build.exs", "priv/repo")

  num_of_companies = 100
  num_of_users = 50
  num_of_merchants = 50
  num_of_transactions = 100

  company_entries =
    for _ <- 1..num_of_companies do
      Build.company_entry()
    end

  {_count, companies} = Homework.Repo.insert_all(Company, company_entries, returning: true)

  user_entries =
    for _ <- 1..num_of_users do
      company = Enum.random(companies)
      Build.user_entry(company)
    end

  {_count, users} = Homework.Repo.insert_all(User, user_entries, returning: true)

  merchant_entries =
    for _ <- 1..num_of_merchants do
      Build.merchant_entry()
    end

  {_count, merchants} = Homework.Repo.insert_all(Merchant, merchant_entries, returning: true)

  transaction_types = [:credit, :debit, :cash]

  transaction_entries =
    for _ <- 1..num_of_transactions do
      user = Enum.random(users)
      merchant = Enum.random(merchants)
      transaction_type = Enum.random(transaction_types)

      Build.transaction_entry(user, merchant, transaction_type)
    end

  Homework.Repo.insert_all(Transaction, transaction_entries)

  Mix.shell().info("The database for Homework.Repo has been seeded")
end
