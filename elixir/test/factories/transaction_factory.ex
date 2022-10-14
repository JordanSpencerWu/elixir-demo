defmodule Homework.TransactionFactory do
  import ExMachina

  defmacro __using__(_opts) do
    quote do
      def transaction_factory(attrs) do
        amount = Map.get(attrs, :amount, 1_000)
        company = Map.get(attrs, :company)
        credit = Map.get(attrs, :credit, false)
        debit = Map.get(attrs, :debit, true)
        description = Map.get(attrs, :description, "default description")
        merchant = Map.get(attrs, :merchant)
        user = Map.get(attrs, :user)

        transaction = %Homework.Transactions.Transaction{
          amount: amount,
          company: company || build(:company),
          credit: credit,
          debit: debit,
          description: description,
          merchant: merchant || build(:merchant),
          user: user || build(:user)
        }

        transaction
        |> merge_attributes(attrs)
        |> evaluate_lazy_attributes()
      end
    end
  end
end
