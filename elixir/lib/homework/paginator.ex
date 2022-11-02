defmodule Homework.Paginator do
  @moduledoc """
  Defines a paginator.
  """

  defmodule Page do
    @moduledoc """
    Defines a page.

    ## Fields
      
    * `entries` - a list entries contained in this page.
    * `offset` - the current offset in entries.
    * `total_rows` - total number of rows.
    """

    @type t :: %__MODULE__{
            entries: [any()] | [],
            offset: non_neg_integer(),
            total_rows: non_neg_integer()
          }

    defstruct [:entries, :offset, :total_rows]
  end

  @doc """
  Will paginate a list of items.

  ## Options

  * `:limit` - Limits the number of records returned per page. Defaults to `10_000`.
  * `:skip` - Define the number of records to skip. Defaults to `0`.
  """
  @spec paginate([any], keyword) :: {:ok, Page.t()} | {:error, String.t()}
  def paginate(items, opts \\ []) do
    limit = Keyword.get(opts, :limit, 10_000)
    skip = Keyword.get(opts, :skip, 0)

    do_paginate(items, limit, skip)
  end

  defp do_paginate(items, limit, skip) when limit >= 0 and skip >= 0 do
    entries =
      if limit == 0 do
        []
      else
        range_start = skip
        range_end = skip + (limit - 1)

        Enum.slice(items, range_start..range_end)
      end

    total_rows = length(items)
    offset = min(skip + limit, total_rows)

    page = %Page{
      entries: entries,
      offset: offset,
      total_rows: total_rows
    }

    {:ok, page}
  end

  defp do_paginate(_items, _limit, _skip) do
    {:error, "Failed to paginate: limit and skip cannot be negative"}
  end
end
