// import React, { useCallback, useEffect, useState } from "react";

// interface ColumnType {
//   title: string;
//   dataIndex: string;
//   key?: string;
//   width?: number;
//   render?: (text: any, record: any, index: number) => React.ReactNode;
// }

// interface CustomGridProps {
//   data?: any[];
//   columns?: ColumnType[];
//   rowKey: string;
//   expandedRowKeys?: React.Key[];
//   onExpand?: (expanded: boolean, record: any) => void;
//   expandedRowRender?: (record: any) => React.ReactNode;
//   summary?: () => React.ReactNode;
// }

// const CustomGrid: React.FC<CustomGridProps> = ({
//   data = [],
//   columns = [],
//   rowKey,
//   expandedRowKeys = [],
//   onExpand,
//   expandedRowRender,
//   summary,
// }) => {
//   const [selectedRange, setSelectedRange] = useState<{ start: any; end: any }>({
//     start: null,
//     end: null,
//   });
//   const [isDragging, setIsDragging] = useState(false);
//   const [isCopied, setIsCopied] = useState(false); // State to track copy action

//   const handleExpandClick = (record: any) => {
//     const isExpanded = expandedRowKeys.includes(record[rowKey]);
//     onExpand?.(!isExpanded, record);
//   };

//   const columnStyle = (col: ColumnType) => ({
//     boxShadow: "inset 0 0 0 0.5px #ddd",
//     width: col.width ? `${col.width}px` : "100px",
//     minWidth: col.width ? `${col.width}px` : "100px",
//     maxWidth: col.width ? `${col.width}px` : "100px",
//     background: "white",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   });

//   const expandColumnStyle: React.CSSProperties = {
//     position: "sticky",
//     left: 0,
//     zIndex: 2,
//     width: "40px",
//     minWidth: "40px",
//     maxWidth: "40px",
//     boxShadow: "inset 0 0 0 0.5px #ddd",
//     background: "white",
//   };

//   const expandCellStyle: React.CSSProperties = {
//     position: "sticky",
//     left: 0,
//     zIndex: 1,
//     textAlign: "center",
//     boxShadow: "inset 0 0 0 0.5px #ddd",
//     background: "white",
//   };

//   const handleCellMouseDown = useCallback(
//     (event: any, rowIndex: number, colIndex: number) => {
//       if (event.button === 2) return; // Ignore right-click

//       if (event.shiftKey && selectedRange.start) {
//         setSelectedRange({
//           start: selectedRange.start,
//           end: { rowIndex, colIndex },
//         });
//       } else {
//         setSelectedRange({
//           start: { rowIndex, colIndex },
//           end: { rowIndex, colIndex },
//         });
//         setIsDragging(true);
//       }
//     },
//     [selectedRange.start]
//   );

//   const handleCellMouseEnter = useCallback(
//     (rowIndex: number, colIndex: number) => {
//       if (isDragging) {
//         setSelectedRange((prevRange) => ({
//           ...prevRange,
//           end: { rowIndex, colIndex },
//         }));
//       }
//     },
//     [isDragging]
//   );

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   useEffect(() => {
//     document.addEventListener("mouseup", handleMouseUp);
//     return () => {
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [handleMouseUp]);

//   const getCellStyle = useCallback(
//     (rowIndex: number, colIndex: number) => {
//       const style: React.CSSProperties = {
//         transition: "background-color 0.1s ease-in-out", // Smooth transition effect
//       };

//       // Selection style
//       if (selectedRange.start && selectedRange.end) {
//         const { start, end } = selectedRange;
//         const startRow = Math.min(start.rowIndex, end.rowIndex);
//         const endRow = Math.max(start.rowIndex, end.rowIndex);
//         const startCol = Math.min(start.colIndex, end.colIndex);
//         const endCol = Math.max(start.colIndex, end.colIndex);

//         if (
//           rowIndex >= startRow &&
//           rowIndex <= endRow &&
//           colIndex >= startCol &&
//           colIndex <= endCol
//         ) {
//           style.backgroundColor = "#d2e6fc"; // Light blue for selection
//         }
//       }

//       // Darkening effect when copied
//       if (isCopied && selectedRange.start && selectedRange.end) {
//         const { start, end } = selectedRange;
//         const startRow = Math.min(start.rowIndex, end.rowIndex);
//         const endRow = Math.max(start.rowIndex, end.rowIndex);
//         const startCol = Math.min(start.colIndex, end.colIndex);
//         const endCol = Math.max(start.colIndex, end.colIndex);

//         if (
//           rowIndex >= startRow &&
//           rowIndex <= endRow &&
//           colIndex >= startCol &&
//           colIndex <= endCol
//         ) {
//           // style.transitionDuration = "all 1s"; // Darker blue for copied cells
//           style.backgroundColor = "#a8d4ff"; // Darker blue for copied cells
//         }
//       }

//       return style;
//     },
//     [selectedRange, isCopied]
//   );

//   const copySelectedText = useCallback(() => {
//     if (selectedRange.start && selectedRange.end) {
//       const { start, end } = selectedRange;
//       const startRow = Math.min(start.rowIndex, end.rowIndex);
//       const endRow = Math.max(start.rowIndex, end.rowIndex);
//       const startCol = Math.min(start.colIndex, end.colIndex);
//       const endCol = Math.max(start.colIndex, end.colIndex);

//       let textToCopy = "";
//       for (let row = startRow; row <= endRow; row++) {
//         let rowText = "";
//         for (let col = startCol; col <= endCol; col++) {
//           const column = columns[col];
//           const cellValue = data[row][column.dataIndex];
//           rowText += (cellValue || "") + "\t";
//         }
//         textToCopy += rowText.trim() + "\n";
//       }

//       navigator.clipboard.writeText(textToCopy.trim());

//       // Trigger darkening effect
//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 1000); // Reset after 1 second
//     }
//   }, [selectedRange, columns, data]);

//   const handleKeyDown = useCallback(
//     (event: KeyboardEvent) => {
//       if ((event.ctrlKey || event.metaKey) && event.key === "c") {
//         event.preventDefault();
//         copySelectedText();
//       }
//     },
//     [copySelectedText]
//   );

//   useEffect(() => {
//     document.addEventListener("keydown", handleKeyDown);
//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [handleKeyDown]);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "500px", border: "1px solid #ddd", userSelect: "none" }}>
//       <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
//         <table style={{ width: "max-content", borderCollapse: "collapse", tableLayout: "fixed" }}>
//           <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 3 }}>
//             <tr>
//               {expandedRowRender && <th style={expandColumnStyle} />}
//               {columns.map((col) => (
//                 <th key={col.key || col.dataIndex} style={columnStyle(col)}>
//                   {col.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <React.Fragment key={row[rowKey]}>
//                 <tr>
//                   {expandedRowRender && (
//                     <td onClick={() => handleExpandClick(row)} style={expandCellStyle}>
//                       {expandedRowKeys.includes(row[rowKey]) ? "▼" : "▶"}
//                     </td>
//                   )}
//                   {columns.map((col, colIndex) => (
//                     <td
//                       key={col.key || col.dataIndex}
//                       style={{ ...columnStyle(col), ...getCellStyle(rowIndex, colIndex) }}
//                       onMouseDown={(event) => handleCellMouseDown(event, rowIndex, colIndex)}
//                       onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
//                     >
//                       {col.render ? col.render(row[col.dataIndex], row, rowIndex) : row[col.dataIndex]}
//                     </td>
//                   ))}
//                 </tr>
//                 {expandedRowRender && expandedRowKeys.includes(row[rowKey]) && (
//                   <tr>
//                     <td colSpan={columns.length + 1} style={{ border: "1px solid #ddd" }}>
//                       {expandedRowRender(row)}
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//           {summary && (
//             <tfoot style={{ position: "sticky", bottom: 0, background: "white", zIndex: 3 }}>
//               <tr>
//                 {expandedRowRender && <td style={expandColumnStyle} />}
//                 {summary()}
//               </tr>
//             </tfoot>
//           )}
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CustomGrid;

import React, { useCallback, useEffect, useState, useRef } from "react";

interface ColumnType {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  render?: (text: any, record: any, index: number) => React.ReactNode;
}

interface CustomGridProps {
  data?: any[];
  columns?: ColumnType[];
  rowKey: string;
  expandedRowKeys?: React.Key[];
  onExpand?: (expanded: boolean, record: any) => void;
  expandedRowRender?: (record: any) => React.ReactNode;
  summary?: () => React.ReactNode;
}

const CustomGrid: React.FC<CustomGridProps> = ({
  data = [],
  columns = [],
  rowKey,
  expandedRowKeys = [],
  onExpand,
  expandedRowRender,
  summary,
}) => {
  const [selectedRange, setSelectedRange] = useState<{ start: any; end: any }>({
    start: null,
    end: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // State to track copy action

  // Ref for the table container
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleExpandClick = (record: any) => {
    const isExpanded = expandedRowKeys.includes(record[rowKey]);
    onExpand?.(!isExpanded, record);
  };

  const columnStyle = (col: ColumnType) => ({
    boxShadow: "inset 0 0 0 0.5px #ddd",
    width: col.width ? `${col.width}px` : "100px",
    minWidth: col.width ? `${col.width}px` : "100px",
    maxWidth: col.width ? `${col.width}px` : "100px",
    background: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding:"5px"
  });

  const expandColumnStyle: React.CSSProperties = {
    position: "sticky",
    left: 0,
    zIndex: 2,
    width: "40px",
    minWidth: "40px",
    maxWidth: "40px",
    boxShadow: "inset 0 0 0 0.5px #ddd",
    background: "white",

  };

  const expandCellStyle: React.CSSProperties = {
    position: "sticky",
    left: 0,
    zIndex: 1,
    textAlign: "center",
    boxShadow: "inset 0 0 0 0.5px #ddd",
    background: "white",
  };

  const handleCellMouseDown = useCallback(
    (event: any, rowIndex: number, colIndex: number) => {
      if (event.button === 2) return; // Ignore right-click

      if (event.shiftKey && selectedRange.start) {
        setSelectedRange({
          start: selectedRange.start,
          end: { rowIndex, colIndex },
        });
      } else {
        setSelectedRange({
          start: { rowIndex, colIndex },
          end: { rowIndex, colIndex },
        });
        setIsDragging(true);
      }
    },
    [selectedRange.start]
  );

  const handleCellMouseEnter = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (isDragging) {
        setSelectedRange((prevRange) => ({
          ...prevRange,
          end: { rowIndex, colIndex },
        }));
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Deselect cells when clicking outside the table
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(event.target as Node)
      ) {
        setSelectedRange({ start: null, end: null }); // Deselect cells
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleMouseUp]);

  const getCellStyle = useCallback(
    (rowIndex: number, colIndex: number) => {
      const style: React.CSSProperties = {
        transition: "background-color 0.1s ease-in-out", // Smooth transition effect
      };

      // Selection style
      if (selectedRange.start && selectedRange.end) {
        const { start, end } = selectedRange;
        const startRow = Math.min(start.rowIndex, end.rowIndex);
        const endRow = Math.max(start.rowIndex, end.rowIndex);
        const startCol = Math.min(start.colIndex, end.colIndex);
        const endCol = Math.max(start.colIndex, end.colIndex);

        if (
          rowIndex >= startRow &&
          rowIndex <= endRow &&
          colIndex >= startCol &&
          colIndex <= endCol
        ) {
          style.backgroundColor = "#d2e6fc"; // Light blue for selection
        }
      }

      // Darkening effect when copied
      if (isCopied && selectedRange.start && selectedRange.end) {
        const { start, end } = selectedRange;
        const startRow = Math.min(start.rowIndex, end.rowIndex);
        const endRow = Math.max(start.rowIndex, end.rowIndex);
        const startCol = Math.min(start.colIndex, end.colIndex);
        const endCol = Math.max(start.colIndex, end.colIndex);

        if (
          rowIndex >= startRow &&
          rowIndex <= endRow &&
          colIndex >= startCol &&
          colIndex <= endCol
        ) {
          style.backgroundColor = "#a8d4ff"; // Darker blue for copied cells
        }
      }

      return style;
    },
    [selectedRange, isCopied]
  );

  const copySelectedText = useCallback(() => {
    if (selectedRange.start && selectedRange.end) {
      const { start, end } = selectedRange;
      const startRow = Math.min(start.rowIndex, end.rowIndex);
      const endRow = Math.max(start.rowIndex, end.rowIndex);
      const startCol = Math.min(start.colIndex, end.colIndex);
      const endCol = Math.max(start.colIndex, end.colIndex);

      let textToCopy = "";
      for (let row = startRow; row <= endRow; row++) {
        let rowText = "";
        for (let col = startCol; col <= endCol; col++) {
          const column = columns[col];
          const cellValue = data[row][column.dataIndex];
          rowText += (cellValue || "") + "\t";
        }
        textToCopy += rowText.trim() + "\n";
      }

      navigator.clipboard.writeText(textToCopy.trim());

      // Trigger darkening effect
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Reset after 1 second
    }
  }, [selectedRange, columns, data]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        event.preventDefault();
        copySelectedText();
      }
    },
    [copySelectedText]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      ref={tableContainerRef}
      style={{ display: "flex", flexDirection: "column", height: "500px", border: "1px solid #ddd", userSelect: "none" }}
    >
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <table style={{ width: "max-content", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 3 }}>
            <tr>
              {expandedRowRender && <th style={expandColumnStyle} />}
              {columns.map((col) => (
                <th key={col.key || col.dataIndex} style={columnStyle(col)}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <React.Fragment key={row[rowKey]}>
                <tr>
                  {expandedRowRender && (
                    <td onClick={() => handleExpandClick(row)} style={expandCellStyle}>
                      {expandedRowKeys.includes(row[rowKey]) ? "▼" : "▶"}
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || col.dataIndex}
                      style={{ ...columnStyle(col), ...getCellStyle(rowIndex, colIndex) }}
                      onMouseDown={(event) => handleCellMouseDown(event, rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                    >
                      {col.render ? col.render(row[col.dataIndex], row, rowIndex) : row[col.dataIndex]}
                    </td>
                  ))}
                </tr>
                {expandedRowRender && expandedRowKeys.includes(row[rowKey]) && (
                  <tr>
                    <td colSpan={columns.length + 1} style={{ border: "1px solid #ddd" }}>
                      {expandedRowRender(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          {summary && (
            <tfoot style={{ position: "sticky", bottom: 0, background: "white", zIndex: 3 }}>
              <tr>
                {expandedRowRender && <td style={expandColumnStyle} />}
                {summary()}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default CustomGrid;