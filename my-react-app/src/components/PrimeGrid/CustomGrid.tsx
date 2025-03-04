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
}

const CustomGrid: React.FC<CustomGridProps> = ({
  data = [],
  columns = [],
  rowKey,
  expandedRowKeys = [],
  onExpand,
  expandedRowRender,
}) => {
  const handleExpandClick = (record: any) => {
    const isExpanded = expandedRowKeys.includes(record[rowKey]);
    onExpand?.(!isExpanded, record);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        width: "100%",
        height: "500px",
        overflow: "auto",
        position: "relative",
      }}
    >
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
            {expandedRowRender && (
              <th
              style={{
                position: "sticky",
                left: 0,
                zIndex: 3,
                width: "40px",
                minWidth: "40px",
                maxWidth: "40px",
                boxShadow: "inset 0 0 0 0.5px #ddd",
                // padding: "8px",
                background: "white",
              }}
              />
            )}
            {columns.map((col) => (
              <th
                key={col.key || col.dataIndex}
                style={{
                  border: "1px solid #ddd",
                  width: col.width ? `${col.width}px` : "100px",
                  minWidth: col.width ? `${col.width}px` : "100px",
                  maxWidth: col.width ? `${col.width}px` : "100px",
                  background: "white",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
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
                  <td
                    onClick={() => handleExpandClick(row)}
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      textAlign: "center",
                      boxShadow: "inset 0 0 0 0.5px #ddd",
                      background: "white",
                    }}
                  >
                    {expandedRowKeys.includes(row[rowKey]) ? "▼" : "▶"}
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key || col.dataIndex}
                    style={{
                      border: "1px solid #ddd",
                      width: col.width ? `${col.width}px` : "100px",
                      minWidth: col.width ? `${col.width}px` : "100px",
                      maxWidth: col.width ? `${col.width}px` : "100px",
                      background: "white",
                      zIndex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
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
      </table>
    </div>
  );
};

export default CustomGrid;
