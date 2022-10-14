defmodule Homework.UserFactory do
  defmacro __using__(_opts) do
    quote do
      def user_factory(attrs) do
        company = Map.get(attrs, :company)
        default_dob = Date.utc_today() |> Date.to_iso8601()
        dob = Map.get(attrs, :dob, default_dob)
        first_name = Map.get(attrs, :first_name, "John")
        last_name = Map.get(attrs, :last_name, "Doe")

        user = %Homework.Users.User{
          company: company || build(:company),
          dob: dob,
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
