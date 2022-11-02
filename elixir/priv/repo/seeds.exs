alias Homework.Companies.Company
alias Homework.Merchants.Merchant
alias Homework.Transactions.Transaction
alias Homework.Users.User

if Mix.env() == :dev do
  [{SeedsFactory, _}] = Code.require_file("seeds_factory.exs", "priv/repo")

  num_of_companies = 100
  num_of_users = 50
  num_of_merchants = 50
  num_of_transactions = 100

  company_entries =
    for seconds <- 1..num_of_companies do
      SeedsFactory.build_company(seconds)
    end

  {_count, companies} = Homework.Repo.insert_all(Company, company_entries, returning: true)

  user_entries =
    for seconds <- 1..num_of_users do
      company = Enum.random(companies)
      SeedsFactory.build_user(company, seconds)
    end

  {_count, users} = Homework.Repo.insert_all(User, user_entries, returning: true)

  merchant_entries =
    for seconds <- 1..num_of_merchants do
      SeedsFactory.build_merchant(seconds)
    end

  {_count, merchants} = Homework.Repo.insert_all(Merchant, merchant_entries, returning: true)

  transaction_types = [:credit, :debit, :cash]

  transaction_entries =
    for seconds <- 1..num_of_transactions do
      user = Enum.random(users)
      merchant = Enum.random(merchants)
      transaction_type = Enum.random(transaction_types)

      SeedsFactory.build_transaction(user, merchant, transaction_type, seconds)
    end

  Homework.Repo.insert_all(Transaction, transaction_entries)

  Mix.shell().info("The database for Homework.Repo has been seeded")
end
