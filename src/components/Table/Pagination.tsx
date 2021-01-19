import React, { useState, useEffect } from "react";

export default function Pagination({
    totalData,
    pageSize,
    totalCol=3,
    onChange
}: {
   totalData: number,
   pageSize: number,
   totalCol?: number,
   onChange: Function
}): JSX.Element {
  const totalPage = Math.floor(totalData / pageSize);
  const [colIndex, setColIndex] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [colList, setColList] = useState<any>([]);

  const generateColList = (page: number, index?: number) => {
    const col = Math.ceil(totalData/pageSize) >= totalCol ? totalCol : Math.ceil(totalData/pageSize);
    const list = [];
    for (let i = 0; i < col; i++) {
      list.push(page + i);
    }
    setColList(list);
    if (typeof index !== "undefined") {
       onChange(list[index]);
      return setPage(list[index]);
    }
    setPage(list[colIndex]);
    onChange(list[colIndex]);
  };

  useEffect(() => {
    const generateFirstList = () => {
        const col = Math.ceil(totalData/pageSize) >= totalCol ? totalCol : Math.ceil(totalData/pageSize);
        const list = [];
        for (let i = 0; i < col; i++) {
          list.push(1 + i);
        }
        setColList(list);
        setPage(list[0]);
      };
    generateFirstList();
  },[totalData, pageSize, totalCol]);

  const handleFirstPage = () => {
    if (currentPage > 1) {
      setColIndex(0);
      generateColList(1, 0);
    }
  };

  const handleLastPage = () => {
    if (currentPage <= totalPage) {
      setColIndex(totalCol - 1);
      generateColList(totalPage - 1, totalCol - 1);
    }
  };

  const handleRightButton = () => {
    const page = colList[0] + totalCol;
    if (page >= totalPage) {
      return handleLastPage();
    }
    generateColList(page);
  };

  const handleLeftButton = () => {
    const page = colList[0] - totalCol;
    if (page < 1) {
      return handleFirstPage();
    }
    generateColList(page);
  };

  const handleClick = (page: number, index: number) => {
    onChange(page);
    setPage(page);
    setColIndex(index);
  };

  return (
      <div className="bg-white flex rounded border-gray-200 border divide-x">
        <div
            aria-label="First Page"
          className="cursor-pointer 
                            px-3
                            py-2 
                            text-center"
          onClick={handleFirstPage}
        >
          {"<<"}
        </div>
        <div
          className="cursor-pointer 
                            px-4
                            py-2 
                            text-center"
          onClick={handleLeftButton}
        >
          {"<"}
        </div>
        {colList.map((item:any, i:number) => (
          <div
            className={`
                            ${
                              item === currentPage
                                ? "bg-primary-light text-white"
                                : ""
                            } 
                            cursor-pointer 
                            px-4 
                            py-2 
                            text-center`}
            key={item}
            onClick={() => handleClick(item, i)}
          >
            {item}
          </div>
        ))}
        <div
          className="cursor-pointer 
                            px-4
                            py-2 
                            text-center"
          onClick={handleRightButton}
        >
          {">"}
        </div>
        <div
          className="cursor-pointer 
                            px-3
                            py-2 
                            text-center"
          onClick={handleLastPage}
        >
          {">>"}
        </div>
      </div>
  );
}