defmodule Homework.MerchantFactory do
  defmacro __using__(_opts) do
    quote do
      def merchant_factory(attrs) do
        epoch = DateTime.from_unix!(0) |> DateTime.to_naive()
        deleted_at = Map.get(attrs, :deleted_at, epoch)
        description = Map.get(attrs, :description, "default description")
        name = Map.get(attrs, :name, "Default Merchant Name")

        merchant = %Homework.Merchants.Merchant{
          deleted_at: deleted_at,
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
