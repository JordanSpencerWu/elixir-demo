defmodule Homework.MerchantFactory do
  defmacro __using__(_opts) do
    quote do
      def merchant_factory(attrs) do
        description = Map.get(attrs, :description, "default description")
        name = Map.get(attrs, :name, "Default Merchant Name")

        merchant = %Homework.Merchants.Merchant{
          description: description,
          name: name
        }

        merchant
        |> merge_attributes(attrs)
        |> evaluate_lazy_attributes()
      end
    end
  end
end
