import React from "react";

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
  });

  const expandColumnStyle: React.CSSProperties = {
    position: "sticky",
    left: 0, // Sticky horizontally
    top: 0,  // Sticky vertically
    zIndex: 3, // Ensure it stays above other elements
    width: "40px",
    minWidth: "40px",
    maxWidth: "40px",
    boxShadow: "inset 0 0 0 0.5px #ddd",
    background: "white",
  };

  const expandCellStyle: React.CSSProperties = {
    position: "sticky",
    left: 0,
    zIndex: 2,
    textAlign: "center",
    boxShadow: "inset 0 0 0 0.5px #ddd",
    background: "white",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "500px", border: "1px solid #ddd" }}>
      {/* Table Header and Body (Scrollable) */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <table
          style={{
            width: "max-content",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          {/* Table Head */}
          <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 2 }}>
            <tr>
              {expandedRowRender && <th style={expandColumnStyle} />}
              {columns.map((col) => (
                <th key={col.key || col.dataIndex} style={columnStyle(col)}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <React.Fragment key={row[rowKey]}>
                <tr>
                  {expandedRowRender && (
                    <td onClick={() => handleExpandClick(row)} style={expandCellStyle}>
                      {expandedRowKeys.includes(row[rowKey]) ? "▼" : "▶"}
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key || col.dataIndex} style={columnStyle(col)}>
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

          {/* Summary Table */}
          {summary && (
            <tfoot style={{ position: "sticky", bottom: 0, background: "white", zIndex: 2 }}>
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