defmodule Homework.CompanyFactory do
  defmacro __using__(_opts) do
    quote do
      def company_factory(attrs) do
        credit_line = Map.get(attrs, :credit_line, 100_000_000)
        name = Map.get(attrs, :name, "Default Company Name")

        merchant = %Homework.Companies.Company{
          credit_line: credit_line,
          name: name
        }

        merchant
        |> merge_attributes(attrs)
        |> evaluate_lazy_attributes()
      end
    end
  end
end
