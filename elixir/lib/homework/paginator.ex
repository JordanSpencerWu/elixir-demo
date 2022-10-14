defmodule Homework.Paginator do
  @moduledoc """
  Defines a paginator.
  """

  defmodule Page do
    @moduledoc """
    Defines a page.

    ## Fields
      
    * `entries` - a list entries contained in this page.
    * `total_rows` - total rows
    """

    @type t :: %__MODULE__{
            entries: [any()] | [],
            total_rows: non_neg_integer()
          }

    defstruct [:entries, :total_rows]
  end

  @doc """
  Will paginate the a list of items.

  ## Options

  * `:limit` - Limits the number of records returned per page. Defaults to `50`.
  * `:skip` - Define the number of records to skip. Defaults to `0`.
  """
  @spec paginate([any], keyword) :: {:ok, Page.t()} | {:error, String.t()}
  def paginate(items, opts \\ []) do
    limit = Keyword.get(opts, :limit, 50)
    skip = Keyword.get(opts, :skip, 0)

    entries =
      if limit == 0 do
        []
      else
        range_start = skip
        range_end = skip + (limit - 1)

        Enum.slice(items, range_start..range_end)
      end

    page = %Page{
      entries: entries,
      total_rows: length(items)
    }

    {:ok, page}
  end
end
