import React from "react";

function ExtraSummaryBox() {
  return (
    <td
      style={{
        fontWeight: "bold",
        background: "#f5f5f5",
        border: "1px solid #ddd",
        padding: "8px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    ></td>
  );
}

export default ExtraSummaryBox;
