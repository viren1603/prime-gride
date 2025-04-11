export interface PrimGridCssType {
  header?: {
    backgroundColor?: any;
    color?: any;
  };
  tableBody?: {
    expandedIconColor?: any;
    rowHeight?: any;
    cellPadding?: any;
  };
  tableFooter?: {
    backgroundColor?: any;
    color?: any;
  };
  tableBorder?: {
    borderRadius?: any;
  };
}

export const PRIM_GRID_CSS: PrimGridCssType = {
  header: {
    backgroundColor: '#D9EEFE',
    // color: '#2169B2',
  },
  tableBody: {
    expandedIconColor: '#3B7FC0',
    rowHeight: '10px',
    cellPadding: '5px 5px',
  },
  tableFooter: {
    backgroundColor: '#D9EEFE',
    // color: '#2169B2',
  },
  tableBorder: {
    // borderRadius: '10px',
  },
};
