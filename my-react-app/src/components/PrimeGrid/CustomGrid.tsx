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
  isResizable?: boolean;
  isDraggable?: boolean;
}

const CustomGrid: React.FC<CustomGridProps> = ({
  data = [],
  columns: initialColumns = [],
  rowKey,
  expandedRowKeys = [],
  onExpand,
  expandedRowRender,
  summary,
  isResizable = false,
  isDraggable = false,
}) => {
  const [selectedRange, setSelectedRange] = useState<{ start: any; end: any }>({
    start: null,
    end: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [isResizing, setIsResizing] = useState(false);
  const [resizeColumnIndex, setResizeColumnIndex] = useState<number | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number | null>(null);
  const [resizeStartWidth, setResizeStartWidth] = useState<number | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns); // State for column order
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null); // Track dragged column
  const [dropColumnIndex, setDropColumnIndex] = useState<number | null>(null); // Track drop target

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleExpandClick = (record: any) => {
    const isExpanded = expandedRowKeys.includes(record[rowKey]);
    onExpand?.(!isExpanded, record);
  };

  const columnStyle = (col: ColumnType, isHeader: boolean = false) => ({
    boxShadow: "inset 0 0 0 0.5px #ddd",
    width: columnWidths[col.dataIndex] ? `${columnWidths[col.dataIndex]}px` : col.width ? `${col.width}px` : "100px",
    minWidth: columnWidths[col.dataIndex] ? `${columnWidths[col.dataIndex]}px` : col.width ? `${col.width}px` : "100px",
    maxWidth: columnWidths[col.dataIndex] ? `${columnWidths[col.dataIndex]}px` : col.width ? `${col.width}px` : "100px",
    background: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "5px",
    position: "relative",
    cursor: isHeader ? "grab" : "default", // Apply grab cursor only to header
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
    setIsResizing(false);
    setResizeColumnIndex(null);
    setResizeStartX(null);
    setResizeStartWidth(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(event.target as Node)
      ) {
        setSelectedRange({ start: null, end: null });
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
        transition: "background-color 0.1s ease-in-out",
      };

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
          style.backgroundColor = "#d2e6fc";
        }
      }

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
          style.backgroundColor = "#a8d4ff";
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

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
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

  const handleResizeMouseDown = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setIsResizing(true);
    setResizeColumnIndex(index);
    setResizeStartX(event.clientX);
    setResizeStartWidth(columnWidths[columns[index].dataIndex] || columns[index].width || 100);
  };

  const handleResizeMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isResizing && resizeColumnIndex !== null && resizeStartX !== null && resizeStartWidth !== null) {
        const newWidth = resizeStartWidth + (event.clientX - resizeStartX);
        setColumnWidths((prevWidths) => ({
          ...prevWidths,
          [columns[resizeColumnIndex].dataIndex]: newWidth,
        }));
      }
    },
    [isResizing, resizeColumnIndex, resizeStartX, resizeStartWidth, columns]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleResizeMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleResizeMouseMove);
    };
  }, [handleResizeMouseMove]);

  // Drag-and-drop column reordering
  const handleColumnDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData("text/plain", index.toString());
    setDraggedColumnIndex(index);
  };

  const handleColumnDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    setDropColumnIndex(index);
  };

  const handleColumnDrop = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    const draggedIndex = Number(event.dataTransfer.getData("text/plain"));
    if (draggedIndex !== index) {
      const newColumns = [...columns];
      const [draggedColumn] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(index, 0, draggedColumn);
      setColumns(newColumns);
    }
    setDraggedColumnIndex(null);
    setDropColumnIndex(null);
  };

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
              {columns.map((col, index) => (
                <th
                  key={col.key || col.dataIndex}
                  style={
                    {
                      ...columnStyle(col, isDraggable), // Apply grab cursor only to header
                      backgroundColor: draggedColumnIndex === index ? "#f0f0f0" : "white",
                      borderRight: dropColumnIndex === index ? "2px solid blue" : "none",
                    } as React.CSSProperties
                  }
                  draggable={isDraggable}
                  onDragStart={isDraggable ? (event) => handleColumnDragStart(event, index) : undefined}
                  onDragOver={isDraggable ? (event) => handleColumnDragOver(event, index) : undefined}
                  onDrop={isDraggable ? (event) => handleColumnDrop(event, index) : undefined}
                >
                  {col.title}
                  {isResizable && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "5px",
                        cursor: "col-resize",
                        backgroundColor: isResizing && resizeColumnIndex === index ? "#000" : "transparent",
                      }}
                      onMouseDown={(event) => handleResizeMouseDown(event, index)}
                    />
                  )}
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
                      style={{ ...columnStyle(col), ...getCellStyle(rowIndex, colIndex) } as React.CSSProperties}
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
            <tfoot style={{ position: "sticky", bottom: 0, background: "white", zIndex: 3 } as React.CSSProperties}>
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