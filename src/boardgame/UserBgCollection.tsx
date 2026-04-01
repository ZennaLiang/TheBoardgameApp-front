import React, { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  FilterFn,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { matchSorter } from "match-sorter";

import { getGuruCollection } from "./apiBoardgame";
import NoImg from "../images/noImageAvailable.jpg";
import { isAuthenticated } from "../auth";
import { getUser } from "../user/apiUser";
import BgContainer from "./BgContainer";

interface BoardgameData {
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

interface CollectionRow {
  boardgame: BoardgameData;
  forTrade: boolean;
  wantFromTrade: boolean;
  wantFromBuy: boolean;
  wantToPlay: boolean;
  notes: string;
}

const fuzzyFilter: FilterFn<CollectionRow> = (row, columnId, value) => {
  const results = matchSorter([row.original], value, {
    keys: [(r) => {
      if (columnId === "title") return `${r.boardgame.title} ${r.boardgame.yearPublished}`;
      return "";
    }],
  });
  return results.length > 0;
};

const numberGteFilter: FilterFn<CollectionRow> = (row, columnId, value) => {
  const rowValue = row.getValue<number>(columnId);
  return rowValue >= Number(value);
};

const numberLteFilter: FilterFn<CollectionRow> = (row, columnId, value) => {
  const rowValue = row.getValue<number>(columnId);
  return rowValue <= Number(value);
};

const yesNoFilter: FilterFn<CollectionRow> = (row, columnId, value) => {
  return String(row.getValue<boolean>(columnId)) === value;
};

const DefaultColumnFilter = ({
  column,
}: {
  column: { getFilterValue: () => unknown; setFilterValue: (v: unknown) => void };
}) => (
  <input
    className="form-control p-0"
    value={(column.getFilterValue() as string) ?? ""}
    onChange={(e) => column.setFilterValue(e.target.value || undefined)}
    placeholder="Search..."
  />
);

const NumberSelectFilter = ({
  column,
}: {
  column: { getFilterValue: () => unknown; setFilterValue: (v: unknown) => void };
}) => (
  <select
    className="form-control p-0"
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
    className="form-control p-0"
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

const YesNoSelectFilter = ({
  column,
}: {
  column: { getFilterValue: () => unknown; setFilterValue: (v: unknown) => void };
}) => (
  <select
    className="form-control p-0"
    value={(column.getFilterValue() as string) ?? ""}
    onChange={(e) => column.setFilterValue(e.target.value || undefined)}
  >
    <option value="">All</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
);

const columns: ColumnDef<CollectionRow>[] = [
  {
    id: "imgThumbnail",
    accessorFn: (row) => row.boardgame.imgThumbnail,
    header: "",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <img
          src={value === "" ? NoImg : value}
          alt=""
          className="img-fluid image-thumbnail"
        />
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
    meta: { className: "text-center d-none d-sm-table-cell maxColWidth-50 px-0" },
  },
  {
    id: "title",
    accessorFn: (row) => `${row.boardgame.title} ${row.boardgame.yearPublished}`,
    header: "Title",
    cell: ({ row }) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://boardgamegeek.com/boardgame/${row.original.boardgame.bggId}`}
      >
        {row.original.boardgame.title} ({row.original.boardgame.yearPublished})
      </a>
    ),
    filterFn: fuzzyFilter,
    meta: { className: "maxColWidth-175" },
  },
  {
    id: "avgRating",
    accessorFn: (row) => row.boardgame.avgRating,
    header: "Rating",
    cell: ({ getValue }) => <span>{Math.round(10 * Number(getValue<string>())) / 10}</span>,
    filterFn: numberGteFilter,
    meta: {
      className: "d-none d-md-table-cell maxColWidth-50 text-truncate",
      FilterComponent: NumberSelectFilter,
    },
  },
  {
    id: "maxPlayers",
    accessorFn: (row) => row.boardgame.maxPlayers,
    header: "Players",
    cell: ({ row }) => (
      <span>
        {row.original.boardgame.minPlayers}-
        {row.original.boardgame.maxPlayers === -1 ? "" : row.original.boardgame.maxPlayers}
      </span>
    ),
    filterFn: numberLteFilter,
    meta: {
      className: "maxColWidth-50 text-truncate",
      FilterComponent: NumberSelectFilter,
    },
  },
  {
    id: "maxPlayTime",
    accessorFn: (row) => row.boardgame.maxPlayTime,
    header: "Play Time",
    cell: ({ row }) => (
      <span>
        {row.original.boardgame.minPlayTime === row.original.boardgame.maxPlayTime
          ? row.original.boardgame.minPlayTime === -1
            ? "--"
            : row.original.boardgame.minPlayTime
          : `${row.original.boardgame.minPlayTime}-${row.original.boardgame.maxPlayTime}`}
      </span>
    ),
    filterFn: numberLteFilter,
    meta: {
      className: "maxColWidth-50",
      FilterComponent: PlayTimeSelectFilter,
    },
  },
  {
    id: "forTrade",
    accessorKey: "forTrade",
    header: "For Trade",
    cell: ({ row }) => (
      <input type="checkbox" className="checkbox" checked={row.original.forTrade === true} readOnly />
    ),
    filterFn: yesNoFilter,
    meta: {
      className: "d-none d-sm-table-cell maxColWidth-50 alignCenter",
      FilterComponent: YesNoSelectFilter,
    },
  },
  {
    id: "wantFromTrade",
    accessorKey: "wantFromTrade",
    header: "Want",
    cell: ({ row }) => (
      <input type="checkbox" className="checkbox text-center" checked={row.original.wantFromTrade === true} readOnly />
    ),
    filterFn: yesNoFilter,
    meta: {
      className: "d-none d-sm-table-cell maxColWidth-50 alignCenter",
      FilterComponent: YesNoSelectFilter,
    },
  },
  {
    id: "wantFromBuy",
    accessorKey: "wantFromBuy",
    header: "To Buy",
    cell: ({ row }) => (
      <input type="checkbox" className="checkbox" checked={row.original.wantFromBuy === true} readOnly />
    ),
    filterFn: yesNoFilter,
    meta: {
      className: "d-none d-sm-table-cell maxColWidth-50 alignCenter",
      FilterComponent: YesNoSelectFilter,
    },
  },
  {
    id: "wantToPlay",
    accessorKey: "wantToPlay",
    header: "To Play",
    cell: ({ row }) => (
      <input type="checkbox" className="checkbox" checked={row.original.wantToPlay === true} readOnly />
    ),
    filterFn: yesNoFilter,
    meta: {
      className: "d-none d-sm-table-cell maxColWidth-50 alignCenter",
      FilterComponent: YesNoSelectFilter,
    },
  },
  {
    id: "notes",
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => <div className="guruNotes pr-0">{String(row.original.notes)}</div>,
    enableColumnFilter: false,
    meta: { className: "d-none d-sm-table-cell maxColWidth-200 text-wrap overflow-auto pr-0" },
  },
];

const Table = ({ data }: { data: CollectionRow[] }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzyFilter, numberGteFilter, numberLteFilter, yesNoFilter },
    state: { columnFilters, sorting, pagination },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <>
      <table className="table table-bordered guruCollectionTable">
        <thead className="thead-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="align-middle">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as any;
                const FilterComponent = meta?.FilterComponent ?? DefaultColumnFilter;
                return (
                  <th
                    key={header.id}
                    scope="col"
                    className={"align-middle p-2 " + (meta?.className ?? "")}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
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
              <td colSpan={10} className="align-middle">No data</td>
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

const UserCollection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CollectionRow[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const auth = isAuthenticated();
    if (!auth) { setIsLoading(false); return; }
    const { token, user } = auth;
    getUser(user._id, token).then((userData) => {
      if (userData.error === undefined) {
        getGuruCollection(user._id, token).then((bggdata) => {
          if (bggdata !== undefined && !bggdata.error) setData(bggdata);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <>
      <Oval height={40} width={40} color="#4fa94d" visible={isLoading} ariaLabel="oval-loading" />
      <BgContainer sidebar="UserCollection">
        <div className="row justify-content-center my-2">
          <div className="col-lg-10 text-center">
            <h2 className="header-font">Guru Collection</h2>
          </div>
          <div className="col-lg-10 text-center">
            <h6 className="header-font">*Please note that collection over 1000 will not work</h6>
          </div>
        </div>
        <div className="row justify-content-center bgTable table-responsive mr-0">
          <Table data={data} />
        </div>
      </BgContainer>
    </>
  );
};

export default UserCollection;
