defmodule Homework.TransactionsTest do
  use Homework.DataCase, async: true

  alias Homework.Transactions

  describe "transactions" do
    alias Homework.Transactions.Transaction
    alias Homework.Factory

    setup do
      company = Factory.insert(:company)
      merchant1 = Factory.insert(:merchant, description: "some description", name: "some name")

      merchant2 =
        Factory.insert(:merchant,
          description: "some updated description",
          name: "some updated name"
        )

      user1 =
        Factory.insert(:user,
          company: company,
          dob: "some dob",
          first_name: "some first_name",
          last_name: "some last_name"
        )

      user2 =
        Factory.insert(:user,
          company: company,
          dob: "some updated dob",
          first_name: "some updated first_name",
          last_name: "some updated last_name"
        )

      valid_attrs = %{
        amount: 42,
        credit: false,
        debit: true,
        description: "some description",
        company_id: company.id,
        merchant_id: merchant1.id,
        user_id: user1.id
      }

      update_attrs = %{
        amount: 43,
        credit: true,
        debit: false,
        description: "some updated description",
        company_id: company.id,
        merchant_id: merchant2.id,
        user_id: user2.id
      }

      invalid_attrs = %{
        amount: nil,
        credit: nil,
        debit: nil,
        description: nil,
        company_id: nil,
        merchant_id: nil,
        user_id: nil
      }

      {:ok,
       %{
         valid_attrs: valid_attrs,
         update_attrs: update_attrs,
         invalid_attrs: invalid_attrs,
         company: company,
         merchant1: merchant1,
         merchant2: merchant2,
         user1: user1,
         user2: user2
       }}
    end

    def transaction_fixture(valid_attrs, attrs \\ %{}) do
      {:ok, transaction} =
        attrs
        |> Enum.into(valid_attrs)
        |> Transactions.create_transaction()

      transaction
    end

    test "list_transactions/1 returns all transactions", %{valid_attrs: valid_attrs} do
      transaction = transaction_fixture(valid_attrs)
      assert Transactions.list_transactions([]) == [transaction]
    end

    test "get_transaction!/1 returns the transaction with given id", %{valid_attrs: valid_attrs} do
      transaction = transaction_fixture(valid_attrs)
      assert Transactions.get_transaction!(transaction.id) == transaction
    end

    test "create_transaction/1 with valid data creates a transaction", %{
      valid_attrs: valid_attrs,
      company: company,
      merchant1: merchant1,
      user1: user1
    } do
      assert {:ok, %Transaction{} = transaction} = Transactions.create_transaction(valid_attrs)
      assert transaction.amount == 42
      assert transaction.credit == false
      assert transaction.debit == true
      assert transaction.description == "some description"
      assert transaction.company_id == company.id
      assert transaction.merchant_id == merchant1.id
      assert transaction.user_id == user1.id
    end

    test "create_transaction/1 with valid data but exceed company's available credit returns error",
         %{valid_attrs: valid_attrs} do
      company = Factory.insert(:company, credit_line: 10_000_000)

      valid_attrs =
        Map.merge(valid_attrs, %{
          company_id: company.id,
          amount: 10_000_000_000,
          credit: true,
          debit: false
        })

      {:error, message} = Transactions.create_transaction(valid_attrs)

      assert message == "failed to create transaction: will exceed company's available credit"
    end

    test "create_transaction/1 with invalid data returns error changeset", %{
      invalid_attrs: invalid_attrs
    } do
      assert {:error, %Ecto.Changeset{}} = Transactions.create_transaction(invalid_attrs)
    end

    test "update_transaction/2 with valid data updates the transaction", %{
      valid_attrs: valid_attrs,
      update_attrs: update_attrs,
      company: company,
      merchant2: merchant2,
      user2: user2
    } do
      transaction = transaction_fixture(valid_attrs)

      assert {:ok, %Transaction{} = transaction} =
               Transactions.update_transaction(transaction, update_attrs)

      assert transaction.amount == 43
      assert transaction.credit == true
      assert transaction.debit == false
      assert transaction.description == "some updated description"
      assert transaction.company_id == company.id
      assert transaction.merchant_id == merchant2.id
      assert transaction.user_id == user2.id
    end

    test "update_transaction/2 with valid data but exceed company's available credit returns error",
         %{
           valid_attrs: valid_attrs
         } do
      transaction = transaction_fixture(valid_attrs)

      update_attrs =
        Map.merge(valid_attrs, %{amount: 100_000_000_000, credit: true, debit: false})

      {:error, message} = Transactions.update_transaction(transaction, update_attrs)

      assert message == "failed to update transaction: will exceed company's available credit"
    end

    test "update_transaction/2 with invalid data returns error changeset", %{
      valid_attrs: valid_attrs,
      invalid_attrs: invalid_attrs
    } do
      transaction = transaction_fixture(valid_attrs)

      assert {:error, %Ecto.Changeset{}} =
               Transactions.update_transaction(transaction, invalid_attrs)

      assert transaction == Transactions.get_transaction!(transaction.id)
    end

    test "delete_transaction/1 deletes the transaction", %{valid_attrs: valid_attrs} do
      transaction = transaction_fixture(valid_attrs)
      assert {:ok, transaction = %Transaction{}} = Transactions.delete_transaction(transaction)
      assert transaction.deleted_at != DateTime.from_unix!(0) |> DateTime.to_naive()
    end

    test "change_transaction/1 returns a transaction changeset", %{valid_attrs: valid_attrs} do
      transaction = transaction_fixture(valid_attrs)
      assert %Ecto.Changeset{} = Transactions.change_transaction(transaction)
    end
  end
end
