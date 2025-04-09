export interface PrimGridCssType {
  header?: {
    backgroundColor: any;
  };
  tableBody?: any;
  tableFooter?: {
    backgroundColor: any;
  };
}

export const PRIM_GRID_CSS: PrimGridCssType = {
  header: {
    backgroundColor: '#D9EEFE',
  },
  tableBody: {
    // boxShadow: 'inset 0 0 0 0.5px #A9A9A9',
    // fontFamily: 'fantasy',
    // background: 'black',
    // color: 'white',
  },
  tableFooter: {
    backgroundColor: '#D9EEFE',
    // fontFamily: 'fantasy',
  },
};
