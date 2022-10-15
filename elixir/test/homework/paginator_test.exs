defmodule Homework.PaginatorTest do
  use Homework.DataCase

  alias Homework.Paginator
  alias Homework.Paginator.Page
  alias Homework.Factory

  describe "paginate/2" do
    test "success: returns page with default options" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies)

      assert length(entries) == num_of_companies
      assert offset == num_of_companies
      assert total_rows == num_of_companies
    end

    test "success: returns page with limit option" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)
      limit = 10

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit)

      assert length(entries) == limit
      assert offset == limit
      assert List.last(entries) == Enum.at(companies, limit - 1)
      assert total_rows == num_of_companies
    end

    test "success: returns page when limit option is greater than total_rows" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)
      limit = 100

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit)

      assert length(entries) == num_of_companies
      assert offset == num_of_companies
      assert total_rows == num_of_companies
    end

    test "success: returns page with empty entries when limit option is 0" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)
      limit = 0

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit)

      assert entries == []
      assert offset == 0
      assert total_rows == num_of_companies
    end

    test "success: returns page with skip option" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)
      skip = 10

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, skip: skip)

      assert length(entries) == num_of_companies - skip
      assert List.first(entries) == Enum.at(companies, skip)
      assert offset == num_of_companies
      assert total_rows == num_of_companies
    end

    test "success: returns page with empty entries when skip option is greater than total_rows" do
      num_of_companies = 10
      companies = Factory.insert_list(num_of_companies, :company)
      skip = 15

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, skip: skip)

      assert entries == []
      assert offset == num_of_companies
      assert total_rows == num_of_companies
    end

    test "success: returns page when limit and skip options" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)
      limit = 10
      skip = 10

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit, skip: skip)

      assert length(entries) == limit
      assert List.first(entries) == Enum.at(companies, skip)
      assert List.last(entries) == Enum.at(companies, skip + limit - 1)
      assert offset == limit + skip
      assert total_rows == num_of_companies
    end

    test "success: returns page when limit and skip options are 0" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)
      limit = 0
      skip = 0

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit, skip: skip)

      assert entries == []
      assert offset == 0
      assert total_rows == num_of_companies
    end

    test "success: returns page when limit and skip options are greater than total_rows" do
      num_of_companies = 50
      companies = Factory.insert_list(num_of_companies, :company)
      limit = 100
      skip = 100

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit, skip: skip)

      assert entries == []
      assert offset == num_of_companies
      assert total_rows == num_of_companies
    end

    test "success: returns all pages correctly" do
      num_of_companies = 25
      companies = Factory.insert_list(num_of_companies, :company)
      limit = 10
      skip = 0

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit, skip: skip)

      assert length(entries) == 10
      assert offset == limit
      assert total_rows == num_of_companies

      skip = offset

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit, skip: skip)

      assert length(entries) == 10
      assert offset == limit + skip
      assert total_rows == num_of_companies

      skip = offset

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit, skip: skip)

      assert length(entries) == 5
      assert offset == num_of_companies
      assert total_rows == num_of_companies

      skip = offset

      {:ok, %Page{entries: entries, offset: offset, total_rows: total_rows}} =
        Paginator.paginate(companies, limit: limit, skip: skip)

      assert entries == []
      assert offset == num_of_companies
      assert total_rows == num_of_companies
    end
  end
end
