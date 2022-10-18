defmodule Homework.UsersTest do
  use Homework.DataCase, async: true

  alias Homework.Users

  describe "users" do
    alias Homework.Users.User
    alias Homework.Factory

    setup do
      company = Factory.insert(:company)

      valid_attrs = %{
        dob: "2022-10-14",
        first_name: "some first_name",
        last_name: "some last_name",
        company_id: company.id
      }

      update_attrs = %{
        dob: "2022-10-15",
        first_name: "some updated first_name",
        last_name: "some updated last_name",
        company_id: company.id
      }

      invalid_attrs = %{dob: nil, first_name: nil, last_name: nil, company_id: nil}

      {:ok,
       %{
         valid_attrs: valid_attrs,
         update_attrs: update_attrs,
         invalid_attrs: invalid_attrs,
         company: company
       }}
    end

    def user_fixture(valid_attrs, attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(valid_attrs)
        |> Users.create_user()

      user
    end

    test "list_users/1 returns all users", %{valid_attrs: valid_attrs} do
      user = user_fixture(valid_attrs)
      assert Users.list_users([]) == [user]
    end

    test "get_user!/1 returns the user with given id", %{valid_attrs: valid_attrs} do
      user = user_fixture(valid_attrs)
      assert Users.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user", %{
      company: company,
      valid_attrs: valid_attrs
    } do
      assert {:ok, %User{} = user} = Users.create_user(valid_attrs)
      assert user.dob == "2022-10-14"
      assert user.first_name == "some first_name"
      assert user.last_name == "some last_name"
      assert user.company_id == company.id
    end

    test "create_user/1 with invalid data returns error changeset", %{
      invalid_attrs: invalid_attrs
    } do
      assert {:error, %Ecto.Changeset{}} = Users.create_user(invalid_attrs)
    end

    test "update_user/2 with valid data updates the user", %{
      valid_attrs: valid_attrs,
      update_attrs: update_attrs
    } do
      user = user_fixture(valid_attrs)
      assert {:ok, %User{} = user} = Users.update_user(user, update_attrs)
      assert user.dob == "2022-10-15"
      assert user.first_name == "some updated first_name"
      assert user.last_name == "some updated last_name"
    end

    test "update_user/2 with invalid data returns error changeset", %{
      valid_attrs: valid_attrs,
      invalid_attrs: invalid_attrs
    } do
      user = user_fixture(valid_attrs)
      assert {:error, %Ecto.Changeset{}} = Users.update_user(user, invalid_attrs)
      assert user == Users.get_user!(user.id)
    end

    test "delete_user/1 soft deletes the user", %{valid_attrs: valid_attrs} do
      user = user_fixture(valid_attrs)
      assert {:ok, user = %User{}} = Users.delete_user(user)
      assert user.deleted_at != DateTime.from_unix!(0) |> DateTime.to_naive()
    end

    test "change_user/1 returns a user changeset", %{valid_attrs: valid_attrs} do
      user = user_fixture(valid_attrs)
      assert %Ecto.Changeset{} = Users.change_user(user)
    end
  end
end
