export interface PrimGridCssType {
  header?: {
    backgroundColor?: any;
    color?: any;
  };
  tableBody?: {
    expandedIconColor?: any;
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
    // boxShadow: 'inset 0 0 0 0.5pxrgb(102, 102, 102)',
    // fontFamily: 'fantasy',
    // background: 'black',
    // color: '#2169B2',
  },
  tableFooter: {
    backgroundColor: '#D9EEFE',
    // color: '#2169B2',
    // fontFamily: 'fantasy',
  },
  tableBorder: {
    // borderRadius: '10px',
  },
};
