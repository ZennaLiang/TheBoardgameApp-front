import React, { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  FilterFn,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { matchSorter } from "match-sorter";

import { getBGCollection } from "./apiBoardgame";
import Alert from "../components/Alert";
import NoImg from "../images/noImageAvailable.jpg";
import { isAuthenticated } from "../auth";
import { getUser } from "../user/apiUser";
import BgContainer from "./BgContainer";

interface BoardgameRow {
  bggId: string;
  title: string;
  yearPublished: number;
  imgThumbnail: string;
  avgRating: string;
  minPlayers: number;
  maxPlayers: number;
  minPlayTime: number;
  maxPlayTime: number;
}

const fuzzyFilter: FilterFn<BoardgameRow> = (row, columnId, value) => {
  const results = matchSorter([row.original], value, {
    keys: [columnId as keyof BoardgameRow],
  });
  return results.length > 0;
};

const numberGteFilter: FilterFn<BoardgameRow> = (row, columnId, value) => {
  const rowValue = row.getValue<number>(columnId);
  return rowValue >= Number(value);
};

const numberLteFilter: FilterFn<BoardgameRow> = (row, columnId, value) => {
  const rowValue = row.getValue<number>(columnId);
  return rowValue <= Number(value);
};

const DefaultColumnFilter = ({
  column,
}: {
  column: { getFilterValue: () => unknown; setFilterValue: (v: unknown) => void; getFacetedRowModel: () => { rows: { length: number } } };
}) => {
  return (
    <input
      className="form-control"
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      placeholder={`Search...`}
    />
  );
};

const NumberSelectFilter = ({
  column,
}: {
  column: { getFilterValue: () => unknown; setFilterValue: (v: unknown) => void };
}) => (
  <select
    className="form-control"
    value={(column.getFilterValue() as string) ?? ""}
    onChange={(e) => column.setFilterValue(e.target.value || undefined)}
  >
    <option value="">All</option>
    {["1", "2", "3", "4", "5", "6", "7", "8"].map((v) => (
      <option key={v} value={v}>{v === "8" ? "8+" : v}</option>
    ))}
  </select>
);

const PlayTimeSelectFilter = ({
  column,
}: {
  column: { getFilterValue: () => unknown; setFilterValue: (v: unknown) => void };
}) => (
  <select
    className="form-control"
    value={(column.getFilterValue() as string) ?? ""}
    onChange={(e) => column.setFilterValue(e.target.value || undefined)}
  >
    <option value="">All</option>
    <option value="30">30mins</option>
    <option value="45">45mins</option>
    <option value="60">60mins</option>
    <option value="90">90mins</option>
    <option value="180">180+mins</option>
  </select>
);

const columns: ColumnDef<BoardgameRow>[] = [
  {
    id: "imgThumbnail",
    accessorKey: "imgThumbnail",
    header: "",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <img
          src={value === "" ? NoImg : value}
          alt=""
          style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
      );
    },
    enableColumnFilter: false,
    meta: { className: "text-center d-none d-sm-table-cell" },
  },
  {
    id: "title",
    accessorFn: (row) => `${row.title} ${row.yearPublished}`,
    header: "Title",
    cell: ({ row }) => (
      <span>
        {row.original.title} ({row.original.yearPublished})
      </span>
    ),
    filterFn: fuzzyFilter,
    meta: { className: "" },
  },
  {
    id: "avgRating",
    accessorKey: "avgRating",
    header: "Rating",
    cell: ({ getValue }) => <span>{Math.round(10 * Number(getValue<string>())) / 10}</span>,
    filterFn: numberGteFilter,
    meta: {
      className: "d-none d-sm-table-cell",
      FilterComponent: NumberSelectFilter,
    },
  },
  {
    id: "maxPlayers",
    accessorKey: "maxPlayers",
    header: "Players",
    cell: ({ row }) => (
      <span>
        {row.original.minPlayers}-
        {row.original.maxPlayers === -1 ? "" : row.original.maxPlayers}
      </span>
    ),
    filterFn: numberLteFilter,
    meta: {
      className: "",
      FilterComponent: NumberSelectFilter,
    },
  },
  {
    id: "maxPlayTime",
    accessorKey: "maxPlayTime",
    header: "Play Time",
    cell: ({ row }) => (
      <span>
        {row.original.minPlayTime === row.original.maxPlayTime
          ? row.original.minPlayTime === -1
            ? "--"
            : row.original.minPlayTime
          : `${row.original.minPlayTime}-${row.original.maxPlayTime}`}
      </span>
    ),
    filterFn: numberLteFilter,
    meta: {
      className: "",
      FilterComponent: PlayTimeSelectFilter,
    },
  },
];

const Table = ({ data }: { data: BoardgameRow[] }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzyFilter, numberGteFilter, numberLteFilter },
    state: { columnFilters, pagination },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      columnVisibility: { minPlayers: false },
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <>
      <table className="table table-bordered">
        <thead className="thead-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="align-bottom">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as any;
                const FilterComponent = meta?.FilterComponent ?? DefaultColumnFilter;
                return (
                  <th
                    key={header.id}
                    scope="col"
                    className={"align-bottom " + (meta?.className ?? "")}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanFilter() && (
                      <div><FilterComponent column={header.column} /></div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="align-middle">No data</td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as any;
                  return (
                    <td
                      key={cell.id}
                      className={"align-middle py-1 table-light " + (meta?.className ?? "")}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="col-12">
        <div className="row justify-content-between mx-2">
          <div>
            <span>
              Page <strong>{pageIndex + 1} of {pageCount || 1}</strong>{" "}
            </span>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className="page-item">
                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="page-link">First</button>
              </li>
              <li className="page-item">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="page-link">Previous</button>
              </li>
              <li className="page-item">
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="page-link">Next</button>
              </li>
              <li className="page-item">
                <button onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()} className="page-link">Last</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

const BggCollection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [data, setData] = useState<BoardgameRow[]>([]);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVible] = useState(false);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setAlertVible(false);
    setUsername(target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    const token = isAuthenticated() && (isAuthenticated() as any).token;
    const userId = isAuthenticated() && (isAuthenticated() as any).user._id;
    if (!token || !userId) { setIsLoading(false); return; }
    getUser(userId, token).then((userData) => {
      if (userData.error === undefined && userData.bggUsername) {
        setUsername(userData.bggUsername);
        getBGCollection(userData.bggUsername, token).then((bggdata) => {
          if (bggdata !== undefined && !bggdata.error) setData(bggdata);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const submitClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setAlertVible(false);
    const token = isAuthenticated() && (isAuthenticated() as any).token;
    await getBGCollection(username, token).then((result) => {
      if (result !== undefined && !result.error) {
        setData(result);
      } else {
        setData([]);
        setAlertStatus("danger");
        setAlertMsg("Unable to get user information, please check if username is valid");
        setAlertVible(true);
      }
      setIsLoading(false);
    });
  };

  return (
    <>
      <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
      <Oval height={40} width={40} color="#4fa94d" visible={isLoading} ariaLabel="oval-loading" />
      <BgContainer sidebar="BggCollection">
        <div className="container-fluid">
          <div className="row justify-content-center text-center my-2">
            <h2 className="header-font">BGG Collection Viewer</h2>
          </div>
          <div className="row justify-content-center text-center my-2">
            <h6 className="header-font">*Please note that collection over 1000 will not work</h6>
          </div>
          <div className="row justify-content-center my-2">
            <div className="col-lg-5 col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="BGG Username"
                  aria-label="Boardgamegeek Username"
                  value={username}
                  onChange={handleChange}
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-info" type="button" onClick={submitClick}>
                    Enter
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center bgTable mx-2">
            <Table data={data} />
          </div>
        </div>
      </BgContainer>
    </>
  );
};

export default BggCollection;
