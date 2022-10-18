defmodule Homework.UserFactory do
  defmacro __using__(_opts) do
    quote do
      def user_factory(attrs) do
        epoch = DateTime.from_unix!(0) |> DateTime.to_naive()
        company = Map.get(attrs, :company)
        default_dob = Date.utc_today() |> Date.to_iso8601()
        deleted_at = Map.get(attrs, :deleted_at, epoch)
        dob = Map.get(attrs, :dob, default_dob)
        first_name = Map.get(attrs, :first_name, "John")
        last_name = Map.get(attrs, :last_name, "Doe")

        user = %Homework.Users.User{
          company: company || build(:company),
          dob: dob,
          deleted_at: deleted_at,
          first_name: first_name,
          last_name: last_name
        }

        user
        |> merge_attributes(attrs)
        |> evaluate_lazy_attributes()
      end
    end
  end
end
