defmodule Homework.Factory do
  use ExMachina.Ecto, repo: Homework.Repo
  use Homework.CompanyFactory
  use Homework.MerchantFactory
  use Homework.TransactionFactory
  use Homework.UserFactory
end
