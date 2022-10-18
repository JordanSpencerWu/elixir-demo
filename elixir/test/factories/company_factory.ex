defmodule Homework.CompanyFactory do
  defmacro __using__(_opts) do
    quote do
      def company_factory(attrs) do
        epoch = DateTime.from_unix!(0) |> DateTime.to_naive()
        credit_line = Map.get(attrs, :credit_line, 100_000_000)
        deleted_at = Map.get(attrs, :deleted_at, epoch)
        name = Map.get(attrs, :name, "Default Company Name")

        company = %Homework.Companies.Company{
          credit_line: credit_line,
          deleted_at: deleted_at,
          name: name
        }

        company
        |> merge_attributes(attrs)
        |> evaluate_lazy_attributes()
      end
    end
  end
end
