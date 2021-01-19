import { useEffect } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Dropdown } from '../Dropdowns/CustomDropdown';
import Pagination from "./Pagination";

export default function Table(
  { columns, data, size=10, totalData, searchValue }: 
  {
    columns: Array<any>, 
    data: Array<any>,
    totalData: number,
    size: number,
    searchValue?: string
  }) {
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      gotoPage,
      setPageSize,
      setGlobalFilter,
      state: { pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: {
          pageSize: size || 10
        }
      },
      useGlobalFilter,
      usePagination,
    )

    useEffect(()=>{
      setGlobalFilter(searchValue);
    },[searchValue, setGlobalFilter])
  
    // Render the UI for your table
    return (
      <div className="block w-full overflow-x-auto">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup:any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column:any) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row:any) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell:any) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            }) 
            }
          </tbody>
        </table>
        {data.length > 0 ? null : <div className="text-center w-full">No Data found</div>}
        {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
        <div className="pagination flex justify-between">
            <div className="flex items-center">
            <span className="text-sm mr-2">Show</span>
            <Dropdown items={
              Array.from({length: 5}, (_,i)=> size*(i+1)).map(pageSize => {
                return {
                  label: `${pageSize}`,
                  value: pageSize
                }
              })
            } 
            defaultValue={`${pageSize}`}
            onChange={(e:any) => {
                console.log(e);
                setPageSize(Number(e))}}
            />
            <span className="text-sm ml-2">per Page</span>
          </div>
          <Pagination pageSize={pageSize} totalData={totalData} onChange={(val:number)=>{
              console.log(val);
              gotoPage(val-1);
            }}/>
        </div>
      </div>
    )
  }