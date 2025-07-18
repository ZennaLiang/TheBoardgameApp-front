import React, { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { useTable, useFilters, usePagination } from "react-table";
import { matchSorter } from "match-sorter";

import { getBGCollection } from "./apiBoardgame";
import Alert from "../components/Alert";
import NoImg from "../images/noImageAvailable.jpg";
import { isAuthenticated } from "../auth";
import { getUser } from "../user/apiUser";
import BgContainer from "./BgContainer";
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      className="form-control"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

const NumberSelectFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <select
      className="form-control"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8+</option>
    </select>
  );
};
const PlayTimeSelectFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <select
      className="form-control"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      <option value="30">30mins</option>
      <option value="45">45mins</option>
      <option value="60">60mins</option>
      <option value="90">90mins</option>
      <option value="180">180+mins</option>
    </select>
  );
};

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
};

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const Table = ({ columns, data }) => {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: {
        pageIndex: 0,
        hiddenColumns: ["minPlayers"],
      },
    },
    useFilters,
    usePagination
  );

  return (
    <>
      <table className="table table-bordered" {...getTableProps()}>
        <thead className="thead-dark ">
          {headerGroups.map((headerGroup) => (
            <tr className="align-bottom" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  scope="col"
                  className={"align-bottom " + column.render("className")}
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <tr>
              <td colSpan="5" className="align-middle">
                No data
              </td>
            </tr>
          ) : (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        className={
                          "align-middle py-1 table-light " +
                          cell.column.render("className")
                        }
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="col-12">
        {" "}
        <div className="row justify-content-between mx-2">
          <div>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>

          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className="page-item">
                <button
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className="page-link"
                >
                  First
                </button>
              </li>
              <li className="page-item">
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="page-link"
                >
                  Previous
                </button>
              </li>

              <li className="page-item">
                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="page-link"
                >
                  Next
                </button>
              </li>
              <li className="page-item">
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className="page-link"
                >
                  Last
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

/****************************************************/
/*************** Custom filter fxns *****************/
/****************************************************/

const filterCheck = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
};

const filterGreaterThan = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
};

const filterLessThan = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return filterValue <= rowValue;
  });
};
const filterLessThanMax = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue <= filterValue;
  });
};

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterCheck.autoRemove = (val) => typeof val !== "number";

const BggCollection = () => {
  const columns = React.useMemo(
    () => [
      {
        accessor: "imgThumbnail",
        Cell: ({ cell: { value } }) => (
          <img
            src={String(value) === "" ? `${NoImg}` : String(value)}
            alt={String(value)}
            style={{ maxWidth: "50px", maxHeight: "50px" }}
          />
        ),

        className: "text-center d-none d-sm-table-cell",
        disableFilters: true,
      },
      {
        Header: "Title",
        className: "",
        accessor: (d) => `${d.title} ${d.yearPublished}`,
        filter: "fuzzyText",
        Cell: ({ row: { original } }) => {
          return (
            <span>
              {String(original.title)} ({String(original.yearPublished)})
            </span>
          );
        },
      },
      {
        Header: "Rating",
        className: "d-none d-sm-table-cell",
        accessor: "avgRating",
        Cell: ({ cell: { value } }) => (
          <span>{Math.round(10 * String(value)) / 10}</span>
        ),
        Filter: NumberSelectFilter,
        filter: filterGreaterThan,
      },
      {
        Header: "Players",
        className: "",
        accessor: "maxPlayers",
        Cell: ({ row: { original } }) => {
          return (
            <span>
              {String(original.minPlayers)}-
              {original.maxPlayers === -1 ? "" : String(original.maxPlayers)}
            </span>
          );
        },
        Filter: NumberSelectFilter,
        filter: filterLessThan,
      },
      {
        Header: "Play Time",
        className: "",
        accessor: "maxPlayTime",
        Cell: ({ row: { original } }) => {
          return (
            <span>
              {original.minPlayTime === original.maxPlayTime
                ? original.minPlayTime === -1
                  ? "--"
                  : original.minPlayTime
                : String(original.minPlayTime) +
                  "-" +
                  String(original.maxPlayTime)}
            </span>
          );
        },
        Filter: PlayTimeSelectFilter,
        filter: filterLessThanMax,
      },
    ],
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVible] = useState(false);

  const handleChange = ({ target }) => {
    setAlertVible(false);
    setUsername(target.value);
  };

  // on load get the username if there's any
  // then grab the collection
  useEffect(() => {
    setIsLoading(true);
    const token = isAuthenticated().token;
    getUser(isAuthenticated().user._id, token).then((data) => {
      if (data.error === undefined && data.bggUsername) {
        setUsername(data.bggUsername);
        getBGCollection(data.bggUsername, token).then((bggdata) => {
          if (bggdata !== undefined && !bggdata.error) {
            setData(bggdata);
          }
        });
      }
    });
    setIsLoading(false);
  }, []);

  async function submitClick(event) {
    if (isLoading) return;
    setIsLoading(true);
    setAlertVible(false);
    await getBGCollection(username, isAuthenticated().token).then((data) => {
      if (data !== undefined && !data.error) {
        setData(data);
      } else {
        setData([]);
        setAlertStatus("danger");
        setAlertMsg(
          "Unable to get user information, please check if username is valid"
        );
        setAlertVible(true);
      }
      setIsLoading(false);
    });
  }

  return (
    <>
      <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
      <Oval
        height={40}
        width={40}
        color="#4fa94d"
        visible={true}
        ariaLabel="oval-loading"
      >
        <BgContainer sidebar="BggCollection">
          <div className="container-fluid">
            <div className="row justify-content-center text-center my-2">
              <h2 className="header-font">BGG Collection Viewer</h2>
            </div>
            <div className="row justify-content-center text-center my-2">
              <h6 className="header-font">
                *Please note that collection over 1000 will not work
              </h6>
            </div>
            <div className="row justify-content-center my-2">
              <div className="col-lg-5 col-md-6">
                <div className="form-group row">
                  <div className="col-12">
                    <div className="input-group ">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="BGG Username"
                        aria-label="Boardgamegeek Username"
                        aria-describedby="bggNameBtn"
                        value={username}
                        onChange={handleChange}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-info"
                          type="button"
                          id="bggNameBtn"
                          onClick={submitClick}
                        >
                          Enter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center bgTable mx-2">
              <Table columns={columns} data={data} />
            </div>
          </div>
        </BgContainer>
      </Oval>
    </>
  );
};

export default BggCollection;
