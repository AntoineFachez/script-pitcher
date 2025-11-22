// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/THEME/MUIPROPS.JS

const randomDeg = Math.random() * 360;
const baseValues = { borderRadius: "0.5rem" };
export const pageStyles = {
  sx: {
    position: "relative",
    // width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // p: "0.5rem",
    backgroundColor: "background.gridItem",
    overflow: "hidden",
  },
};
export const pageHeaderStyles = {
  component: "",
  sx: { position: "sticky", top: 0, width: "100%" },
};
export const pageTitleStyles = {
  component: "",
  variant: "h2",
  sx: {
    width: "100%",
    // height: "5rem",
    // borderRadius: "1rem",
    // m: 1,
    // p: 1,
    textAlign: "center",
    backgroundColor: "primary.dark",
  },
};
export const pageMenuStyles = {
  component: "",
  sx: {
    marginBottom: 0,
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
};
export const pageMainStyles = {
  component: "",
  sx: {
    // display: "flex",
    width: "100%",
    height: "100%",
    // flexFlow: "column nowrap",
    // justifyContent: "center",
    overflow: "scroll",
  },
};
export const profileAvatarStyles = {
  sx: {
    position: "absolute",
    bottom: 130,
    left: "2rem",
  },
};
export const profileHeaderStyles = {
  sx: {
    width: "100%",
    pl: "2rem",
    textAlign: "left",
    pl: "2rem",
  },
};
export const profileDescriptionTextStyles = {
  sx: {
    pl: "2rem",
  },
};
export const widgetContainerStyles = {
  sx: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // p: "0.5rem",
    // backgroundColor: "background.background",
    overflow: "auto",
  },
};
export const containerStyles = {
  component: "",
  sx: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    m: 0,
    p: 0,
  },
};
export const modalStyles = {
  sx: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: "50ch",
    // width: "100%",
    // height: "100%",
    // height: "100vh",
    maxHeight: "100vh",
    bgcolor: "background.paper",
    border: "1px solid #ffffff20",
    borderRadius: `${baseValues.borderRadius}`,
    boxShadow: 24,
    p: 4,
  },
};
export const titleStyle = {
  component: "",
  variant: "h2",
  sx: {
    width: "100%",
    height: "5rem",
    // borderRadius: "1rem",
    // m: 1,
    // p: 1,
    textAlign: "center",
    backgroundColor: "primary.dark",
  },
};
export const draggableStyles = {
  component: "",
  sx: {
    width: "fit-content",
    // height: `${100}%`,
    // height: "100%",
    height: "fit-content",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    borderRadius: `${baseValues.borderRadius}`,

    backgroundColor: "transparent",
    cursor: "grab",
  },
};
export const flexListStyles = {
  sx: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexGrow: 3,
    flexShrink: 3,
    flexFlow: "row wrap",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 1,
    // p: "0.5rem",
    overflowY: "scroll",
    // scrollSnapType: "y proximity",
    // scrollSnapType: "both mandatory",
    // scrollPadding: "0.5rem",
    // borderRadius: "0 0 4px 4px",
  },
};
export const flexListItemStyles = {
  sx: {
    width: "100%",
    maxWidth: 345,
    height: "100%",
    maxHeight: 400,
    display: "flex",
    flexFlow: "column nowrap",
    p: 0,
    m: 0,
    backgroundColor: "background.nav",
  },
};
export const sectionHeaderStyles = {
  sx: { position: "sticky", top: 0, pt: "2rem" },
};
export const cardActionStyles = {
  sx: {
    // width: "4ch",
    // maxWidth: "4ch",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
export const iconButtonStyles = {
  sx: { width: "2rem", height: "2rem", "& >*": { fontSize: "1.2rem" } },
};
export const subtitleStyles = {
  sx: {
    width: "100%",
    display: "flex",
    flexFlow: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 1,
  },
};
export const subtitleItemStyles = {
  sx: {
    width: "100%",
    display: "flex",
    textAlign: "center",
  },
};
export const bottomNavcenterButtonStyles = {
  sx: {
    position: "absolute",
    zIndex: 10,
    top: "50%",
    transform: "translate(0%, -48px)",
    // width: "3rem",
    height: "5rem",
    "& >*": { fontSize: "2.5rem" },
    backgroundColor: "background.nav",
    borderRadius: "50%",
    scale: 1.5,
    "&:hover": { backgroundColor: "background.nav" },
  },
};
export const backButtonStyles = { sx: { position: "absolute", zIndex: 10 } };
export const sharedComponents = {
  MuiAppBar: {
    defaultProps: {
      // size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        height: "fit-content",
        padding: 0,
        border: "none",
        borderRadius: 0,
      }),
    },
  },
  MuiNav: {
    defaultProps: {
      // size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        height: "fit-content",
        padding: 0,
      }),
    },
  },
  MuiToolbar: {
    defaultProps: {
      // size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        height: "fit-content",
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.input,
        fontSize: "1rem",
      }),
    },
  },
  MuiGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
        // backgroundColor: theme.palette.primary.dark,
      }),
    },
  },

  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        display: "flex",
        flex: "6 2 300px",
        flexFlow: "row wrap",
        // flexShrink: 4,
        // flexGrow: 4,
        p: 0,
        m: 0,
        backgroundColor: theme.palette.background.gridItem,
        "&:hover": { backgroundColor: theme.palette.background.default },
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: "auto",
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
        },
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.alpha,
        "&:hover": {
          backgroundColor: theme.palette.action.dark,
        },
      }),
    },
  },

  MuiPaper: {
    defaultProps: {
      elevation: 16,
      variant: "outlined",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: `${baseValues.borderRadius}`,
        padding: "24px",
        boxShadow: `0 4px 6px ${theme.palette.background.shadow}`,
        backgroundColor: theme.palette.background.default,
      }),
    },
  },
  MuiTypography: {
    styleOverrides: {
      h1: ({ theme }) => ({
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        fontSize: 72,
        marginBottom: "1rem",
        textAlign: "center",

        color: theme.palette.text.primary,
      }),

      h2: ({ theme }) => ({
        fontSize: 48,
        fontWeight: 200,
        marginBottom: 8,
        textAlign: "center",
        // Example: Use a different color for light vs. dark mode
        color:
          theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.dark,
      }),
      h4: ({ theme }) => ({
        fontWeight: "bold",
        marginBottom: "1rem",
        textAlign: "center",
        // Example: Use a different color for light vs. dark mode
        color:
          theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.dark,
      }),
      h5: {
        fontWeight: "bold",
        // marginTop: "2rem",
        marginBottom: "0.5rem",
      },
      body1: { fontWeight: "100", lineHeight: 1.6, padding: "8px" },
      subtitle1: { fontWeight: "100", lineHeight: 1.6, padding: "8px" },
      subtitle2: {
        fontSize: "0.6rem",
        fontWeight: "100",
        lineHeight: 0,
        padding: "0",
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      root: {
        // padding: 0,
        // margin: 0,
        display: "flex",
        flexFlow: "row nowrap",
        "& >*": {
          display: "flex",
          flexFlow: "row nowrap",
          borderRadius: "5px",
          // border: "1px blue solid",
          padding: 0,
          margin: 0,
          backgroundColor: "transparent",
        },
      },
    },
  },
  // MuiMenuItem: {
  //   styleOverrides: {
  //     root: ({ theme }) => ({
  //       backgroundColor: theme.palette.primary.alpha,
  //       // backgroundColor: "#333433cc",
  //     }),
  //   },
  // },
  MuiLink: {
    styleOverrides: {
      root: {
        color: "text.primary",
        fontWeight: "100",
        letterSpacing: "0px",
        fontSize: "1.3rem",
        lineHeight: "2rem",
        // transition:
        //   "letter-spacing 0.1s ease-in-out, font-size 0.1s ease-in-out, font-weight 0.1s ease-in-out, color 0.1s ease-in-out",

        "&:hover": {
          width: "fit-content",
          fontWeight: "200",
          // letterSpacing: "1px",
          // backgroundColor: "primary.dark",
          // fontSize: "1.3rem",
          color: "white",
          textDecoration: "underline",
        },
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      },
    },
  },

  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: "#4b5563", // gray-700
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "0 1.5rem",
        color: "#e5e7eb",
        borderBottom: "1px solid #4b5563",
      },
      head: {
        fontSize: "0.75rem",
        fontWeight: "medium",
        color: "#d1d5db",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: "#4b5563",
        },
        transition: "background-color 0.2s",
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        height: "100%",
        overflow: "scroll",
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        "&:hover": {
          // color: "red",
          // You can add other hover styles here, like a background color
          backgroundColor: "rgba(255, 0, 0, 0.1)",
        },
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: ({ theme }) => ({
        // backgroundColor: theme.palette.primary.alpha,
        // backgroundColor: "#333433cc",
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: { width: "100%", height: "100%", p: 0, m: 0 },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: { width: "100%", height: "100%", p: 0, m: 0 },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        width: "100%",
        height: "100%",
        p: 0,
        m: 0,
        padding: 0,
        marginTop: 0,
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        margin: 0,
        flexShrink: 0,
        borderWidth: 0,
        borderStyle: "solid",
        borderColor: "#ffffff1f",
        borderBottomWidth: "thin",
        marginTop: "2rem",
        marginBottom: "2rem",
      },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: 72,
        height: 72,
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: 12,
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: 36,
        height: 36,
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
        },
        backgroundColor: theme.palette.button.background,
        color: theme.palette.button.inactive,
        "&:hover": {
          backgroundColor: theme.palette.button.hover,
          color: theme.palette.secondary.main,
        },
        "& >*": {},
      }),
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: 24,
        height: 24,
        "&:hover": {
          backgroundColor: "transparent",
          color: theme.palette.secondary.main,
        },
        "&:focus": {
          color: theme.palette.button.active,
        },
      }),
    },
  },
  // MuiDataGrid: {
  //   styleOverwrites: {
  //     root: {
  //       border: "none",
  //       outline: "none",
  //       borderRadius: 0,
  //       borderTopLeftRadius: 0,
  //       borderTopRightRadius: 0,
  //       "& .activeRow": {
  //         border: "none",
  //         outline: "none",
  //         backgroundColor: "steelblue",
  //         "&:hover": {
  //           /* Nest the hover pseudo-class here */
  //           backgroundColor:
  //             "steelblue" /* Change the hover color to dodgerblue */,
  //         },
  //         "& > *": {
  //           outline: "none",
  //           border: "none",
  //         },
  //       },
  //       "& .inactiveRow": {
  //         backgroundColor: "grey",
  //         "&:hover": {
  //           backgroundColor: "green" /* Change the hover color to dodgerblue */,
  //         },
  //         "& > *": {},
  //       },
  //     },
  //   },
  // },

  MuiDataGrid: {
    styleOverrides: {
      row: ({ theme }) => ({
        // backgroundColor: "#9ccae9ff",
        "&:hover": {
          backgroundColor: theme.palette.action.dark,
        },
      }),
      root: ({ theme }) => ({
        "& .highlighted-row": {
          backgroundColor: theme.palette.secondary.dark,
          "&:hover": {
            backgroundColor: theme.palette.action.light,
          },
        },
        "& .passed-row": {
          color: "#aaaaaa80",
          backgroundColor: "#33333380",
          "&:hover": {
            backgroundColor: theme.palette.action.light,
          },
        },
        backgroundColor: "transparent",
        "& .MuiDataGrid-toolbar": {
          display: "flex",
          justifyContent: "space-between",
          "&:hover": { backgroundColor: "#333433" },
        },
        //       border: "none",
        "& .MuiDataGrid-topContainer": {
          //         // height: "100%",
          //         color: "#fff",
          //         backgroundColor: "#333433",
        },
        "& .MuiDataGrid-main > *": {
          //         // height: "100%",
          //         borderTopLeftRadius: 0,
          //         borderTopRightRadius: 0,
          //         // backgroundColor: "red",
        },
        "& .MuiDataGrid-virtualScroller": {
          //   height: "100%",
          //   scrollbarWidth: "auto",
        },
        //       // "& .MuiDataGrid-virtualScroller > *": { height: "100%" },
        "& .MuiDataGrid-scrollbar": {
          //   // height: "100%",
          //   position: "relative",
          //   scrollbarWidth: "auto",
        },
        "& .MuiDataGrid-virtualScrollerContent": {
          //         height: "100%",
        },
        "& .MuiDataGrid-root--densityComfortable": {
          //         border: "none",
          //         outline: "none",
        },
        "& .MuiDataGrid-withBorderColor > *": {
          // backgroundColor: "steelblue",
          //         border: "none",
          //         outline: "none",
        },
        "& .MuiDataGrid-columnHeader": {
          // backgroundColor: "steelblue",
          //         // width: "100%",
          //         color: "#fff",
          // backgroundColor: "#333433",
        },
        "& .MuiDataGrid-filler": {
          //         // width: "100%",
          //         // height: "1rem",
          //         color: "#fff",
          // backgroundColor: "#fff",
          //         "& >*": {
          //           // height: "1rem",
          //         },
        },
        "& .MuiDataGrid-columnSeparator > *": {
          //         // width: "100%",
          // color: "#fff",
          // backgroundColor: "steelblue",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          //         display: "flex",
          //         justifyContent: "space-between",
          //         alignItems: "center",
          // backgroundColor: "steelblue",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer > svg": {
          //         // width: "100%",
          //         color: "#fff",
          // backgroundColor: "#333433",
          //         "&:hover": {
          //           color: "white",
          //           backgroundColor: "steelblue",
          //         },
        },

        "& .MuiDataGrid-iconButtonContainer > *": {
          //         width: "1rem",
          //         height: "1rem",
          //         color: "white",
          //         backgroundColor: "steelblue",
        },
        "& .MuiDataGrid-menuIcon, & .MuiDataGrid-menuIcon > *": {
          //         border: "none",
          //         color: "#fff",
          //         outline: "none",
        },
        "& .MuiDataGrid-cell": {
          position: "relative",
          color: "#aaa",
          outline: "none",
          userSelect: "none",
        },
        "& .MuiDataGrid-cell--accordion": {
          padding: 0,
          overflow: "visible !important",
        },
        //       "& .MuiDataGrid-cell:active": {
        //         outline: "none",
        //       },
        //       "& .MuiDataGrid-cell:focus": {
        //         color: "#fff",
        //         outline: "none",
        //       },
        //       "& .MuiDataGrid-cell:hover": {
        //         color: "#fff",
        //       },

        "& .MuiTablePagination-select .MuiInputBase-root": {
          width: "5rem",
          backgroundColor: "white",
        },
      }),
    },
  },
};
