import React, { useCallback, useEffect, useState, useRef } from 'react';
import { PRIM_GRID_CSS } from '../cssExport/CssExport';

export interface ColumnType {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  fixed?: 'left' | 'right'; // New property for fixed columns
  sorter?: 'default' | ((a: any, b: any) => number);
}
export interface SummaryType {
  [key: string]: {
    value: string | number;
    style?: React.CSSProperties;
    className?: string;
  };
}

interface CustomGridProps {
  data?: any[];
  columns?: ColumnType[];
  rowKey: string;
  // Expanded Start
  expandedRowKeys?: React.Key[];
  onExpand?: (expanded: boolean, record: any) => void;
  expandedRow?: boolean;
  expandedRowRender?: (record: any) => React.ReactNode;
  tableZIndex?: number;
  // Expanded End
  summary?: SummaryType;
  isResizable?: boolean;
  isDraggable?: boolean;
  onSort?: (sortedData: any[], sortColumn: string, sortDirection: 'asc' | 'desc' | 'asItIs') => void;
}

const PrimGrid: React.FC<CustomGridProps> = ({
  data = [],
  columns: initialColumns = [],
  rowKey,
  expandedRowKeys = [],
  onExpand,
  expandedRowRender,
  summary,
  isResizable = false,
  isDraggable = false,
  expandedRow = false,
  tableZIndex = 0,
  onSort,
}) => {
  const [selectedRange, setSelectedRange] = useState<{ start: any; end: any }>({
    start: null,
    end: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [gridData, setGridData] = useState(data);
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
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'asItIs'>('asItIs');

  const handleExpandClick = (record: any) => {
    const isExpanded = expandedRowKeys.includes(record[rowKey]);
    onExpand?.(!isExpanded, record);
  };

  const getFixedPosition = (col: ColumnType, index: number) => {
    if (!col.fixed) return {};

    let left = 0;
    let right = 0;

    if (col.fixed === 'left') {
      for (let i = 0; i < index; i++) {
        if (columns[i].fixed === 'left') {
          // left += columnWidths[columns[i].dataIndex] || (expandedRowKeys?.length != 0 ? Number(columns[i].width) + 10 + 40 :  Number(columns[i].width) + 10  ) || 100;
          left += columnWidths[columns[i].dataIndex] || Number(columns[i].width) + 10 || 100;
        }
      }
      return { left };
    }

    if (col.fixed === 'right') {
      for (let i = columns.length - 1; i > index; i--) {
        if (columns[i].fixed === 'right') {
          right += columnWidths[columns[i].dataIndex] || columns[i].width || 100;
        }
      }
      return { right };
    }

    return {};
  };

  const columnStyle = (col: ColumnType, index: number, isHeader: boolean = false) => ({
    // boxShadow: 'inset 0 0 0 0.5px black',
    boxShadow: `inset 0 0 0 0.2px #ddd, inset ${index !== 0 ? '0.2px' : '0px'} -0.5px 0 0 #ddd`,
    // border: '1px solid #ddd',
    width: columnWidths[col.dataIndex] ? `${columnWidths[col.dataIndex]}px` : col.width ? `${col.width}px` : '100px',
    minWidth: columnWidths[col.dataIndex] ? `${columnWidths[col.dataIndex]}px` : col.width ? `${col.width}px` : '100px',
    maxWidth: columnWidths[col.dataIndex] ? `${columnWidths[col.dataIndex]}px` : col.width ? `${col.width}px` : '100px',
    background: 'white',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '5px',
    position: col.fixed ? 'sticky' : 'relative', // Apply sticky position for fixed columns
    ...getFixedPosition(col, index),
    zIndex: col.fixed ? 2 : undefined,
    cursor: isHeader ? 'grab' : 'default', // Apply grab cursor only to header
  });

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
    [selectedRange.start],
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
    [isDragging],
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
      if (tableContainerRef.current && !tableContainerRef.current.contains(event.target as Node)) {
        setSelectedRange({ start: null, end: null });
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleMouseUp]);

  const getCellStyle = useCallback(
    (rowIndex: number, colIndex: number) => {
      const style: React.CSSProperties = {
        transition: 'background-color 0.1s ease-in-out',
      };

      if (selectedRange.start && selectedRange.end) {
        const { start, end } = selectedRange;
        const startRow = Math.min(start.rowIndex, end.rowIndex);
        const endRow = Math.max(start.rowIndex, end.rowIndex);
        const startCol = Math.min(start.colIndex, end.colIndex);
        const endCol = Math.max(start.colIndex, end.colIndex);

        // Selected Range Bg Color
        if (rowIndex >= startRow && rowIndex <= endRow && colIndex >= startCol && colIndex <= endCol) {
          style.backgroundColor = '#d2e6fc';
        } else {
          style.backgroundColor = 'white'; // Reset background color for cells outside the selected range
        }
      } else {
        style.backgroundColor = 'white'; // Reset background color when no range is selected
      }

      if (isCopied && selectedRange.start && selectedRange.end) {
        const { start, end } = selectedRange;
        const startRow = Math.min(start.rowIndex, end.rowIndex);
        const endRow = Math.max(start.rowIndex, end.rowIndex);
        const startCol = Math.min(start.colIndex, end.colIndex);
        const endCol = Math.max(start.colIndex, end.colIndex);

        // when we click C + C  // - Bg Color
        if (rowIndex >= startRow && rowIndex <= endRow && colIndex >= startCol && colIndex <= endCol) {
          style.backgroundColor = '#a8d4ff';
        }
      }

      return style;
    },
    [selectedRange, isCopied],
  );

  const copySelectedText = useCallback(() => {
    if (selectedRange.start && selectedRange.end) {
      const { start, end } = selectedRange;
      const startRow = Math.min(start.rowIndex, end.rowIndex);
      const endRow = Math.max(start.rowIndex, end.rowIndex);
      const startCol = Math.min(start.colIndex, end.colIndex);
      const endCol = Math.max(start.colIndex, end.colIndex);

      let textToCopy = '';
      for (let row = startRow; row <= endRow; row++) {
        let rowText = '';
        for (let col = startCol; col <= endCol; col++) {
          const column = columns[col];
          const cellValue = gridData[row][column.dataIndex];
          rowText += (cellValue || '') + '\t';
        }
        textToCopy += rowText.trim() + '\n';
      }

      navigator.clipboard.writeText(textToCopy.trim());

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    }
  }, [selectedRange, columns, gridData]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        copySelectedText();
      }
    },
    [copySelectedText],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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
    [isResizing, resizeColumnIndex, resizeStartX, resizeStartWidth, columns],
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleResizeMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
    };
  }, [handleResizeMouseMove]);

  // Drag-and-drop column reordering
  const handleColumnDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
    setDraggedColumnIndex(index);
  };

  const handleColumnDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    setDropColumnIndex(index);
  };

  const handleColumnDrop = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    const draggedIndex = Number(event.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index) {
      const newColumns = [...columns];
      const [draggedColumn] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(index, 0, draggedColumn);
      setColumns(newColumns);
    }
    setDraggedColumnIndex(null);
    setDropColumnIndex(null);
  };

  const defaultExpandedRow: ColumnType = {
    title: '',
    dataIndex: 'expanded',
    key: 'expanded',
    width: 30,
    render: (text: any, record: any) => {
      return (
        <div
          onClick={() => handleExpandClick(record)}
          style={{ cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {expandedRowKeys.includes(record[rowKey]) ? '▼' : '▶'}
        </div>
      );
    },
    fixed: 'left',
  };

  useEffect(() => {
    if (expandedRow) {
      setColumns([defaultExpandedRow, ...initialColumns]);
    }
  }, [expandedRow, initialColumns]);
  const defaultSorter = (a: any, b: any, direction: 'asc' | 'desc' | 'asItIs' | null) => {
    if (direction === null || direction === 'asItIs') return 0;
    const modifier = direction === 'asc' ? 1 : -1;

    // Numeric comparison
    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * modifier;
    }

    // String comparison
    const aStr = String(a || '').toLowerCase();
    const bStr = String(b || '').toLowerCase();
    return aStr.localeCompare(bStr) * modifier;
  };
  const handleSort = (column: ColumnType) => {
    if (!column.sorter) return;

    let newDirection: 'asc' | 'desc' | 'asItIs' = 'asc';
    if (sortColumn === column.dataIndex) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = 'asItIs';
      } else {
        newDirection = 'asc';
      }
    }

    setSortColumn(newDirection ? column.dataIndex : null);
    setSortDirection(newDirection);

    if (typeof onSort === 'function') {
      if (newDirection === 'asItIs' || newDirection === null) {
        setGridData([...data]);
      } else {
        const sorted = [...gridData].sort((a, b) => {
          if (column.sorter === 'default') {
            return defaultSorter(a[column.dataIndex], b[column.dataIndex], newDirection);
          }
          return (column.sorter as (a: any, b: any) => number)(a, b);
        });
        // onSort(sorted, column.dataIndex, newDirection);
        setGridData(sorted);
      }
    }
  };

  return (
    <div
      ref={tableContainerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #ddd',
        userSelect: 'none',
      }}
    >
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <table
          style={{
            width: 'max-content',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <thead
            style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 3 - tableZIndex,
            }}
          >
            <tr>
              {/* {expandedRowRender && <th style={expandColumnStyle} />} */}
              {columns.map((col, index) => (
                <th
                  key={col.key || col.dataIndex}
                  style={
                    {
                      ...columnStyle(col, index, isDraggable), // Apply grab cursor only to header
                      backgroundColor:
                        draggedColumnIndex === index ? '#f0f0f0' : PRIM_GRID_CSS?.header?.backgroundColor || 'white',
                      borderRight: dropColumnIndex === index ? '2px solid blue' : 'none',
                      cursor: col.sorter ? 'pointer' : 'grab', // Change cursor for sortable columns
                    } as React.CSSProperties
                  }
                  draggable={isDraggable}
                  onDragStart={isDraggable ? (event) => handleColumnDragStart(event, index) : undefined}
                  onDragOver={isDraggable ? (event) => handleColumnDragOver(event, index) : undefined}
                  onDrop={isDraggable ? (event) => handleColumnDrop(event, index) : undefined}
                  onClick={() => col.sorter && handleSort(col)}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {col.title}
                    {/* {console.log(col == sorter, 'columns')} */}
                    {col?.sorter == 'default' && (
                      <span style={{ marginLeft: 8, fontSize: 12, display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                          <div
                            style={{
                              fontSize: '8.5px',
                              color: sortDirection === 'asc' && sortColumn === col.dataIndex ? 'blue' : 'black',
                            }}
                          >
                            ▲
                          </div>
                          <div
                            style={{
                              fontSize: '8.5px',
                              color: sortDirection === 'desc' && sortColumn === col.dataIndex ? 'blue' : 'black',
                            }}
                          >
                            ▼
                          </div>
                        </div>
                      </span>
                    )}
                  </div>
                  {isResizable && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '5px',
                        cursor: 'col-resize',
                        backgroundColor: isResizing && resizeColumnIndex === index ? '#000' : 'transparent',
                      }}
                      onMouseDown={(event) => handleResizeMouseDown(event, index)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridData.map((row, rowIndex) => (
              <React.Fragment key={`${row[rowKey]}-${rowIndex}`}>
                <tr>
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || col.dataIndex}
                      style={
                        {
                          ...columnStyle(col, colIndex),
                          ...getCellStyle(rowIndex, colIndex),
                          // ...PRIM_GRID_CSS?.tableBody,
                        } as React.CSSProperties
                      }
                      onMouseDown={(event) => {
                        col?.key != 'expanded' && handleCellMouseDown(event, rowIndex, colIndex);
                      }}
                      onMouseEnter={() => {
                        col?.key != 'expanded' && handleCellMouseEnter(rowIndex, colIndex);
                      }}
                    >
                      {col.render ? col.render(row[col.dataIndex], row, rowIndex) : row[col.dataIndex]}
                    </td>
                  ))}
                </tr>
                {expandedRowRender && expandedRowKeys.includes(row[rowKey]) && (
                  <tr>
                    <td colSpan={columns.length + 1} style={{ border: '1px solid #ddd' }}>
                      {expandedRowRender(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          {summary && (
            <tfoot
              style={
                {
                  position: 'sticky',
                  bottom: 0,
                  background: 'white',
                  zIndex: 3 - tableZIndex, // Adjust z-index for summary
                } as React.CSSProperties
              }
            >
              <tr>
                {columns.map((col, index) => {
                  const summaryCellProps = summary[col.title] || {}; // Use col.title as key
                  const { value, className, style } = summaryCellProps;
                  return (
                    <td
                      key={col.key || col.dataIndex}
                      style={{
                        fontWeight: 'bold',
                        boxShadow: 'inset 0 0 0 0.5px black',
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        ...style,
                        ...({
                          ...columnStyle(col, index),
                        } as React.CSSProperties),
                        // ...PRIM_GRID_CSS?.tableFooter,
                        backgroundColor: PRIM_GRID_CSS?.tableFooter?.backgroundColor || '#f5f5f5',
                      }}
                      className={className || ''}
                      title={String(summary[col.title]?.value) || ''} // Show full text on hover
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default PrimGrid;
