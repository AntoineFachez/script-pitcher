// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/THEME/MUIPROPS.JS

const randomDeg = Math.random() * 360;
const baseValues = { borderRadius: "0.5rem" };

export const pageHeaderProps = {
  className: "pageHeader",
  component: "",
  sx: {
    position: "sticky",
    top: 0,
    width: "100%",
    height: "auto",
    backgroundColor: "page.header",
  },
};

export const pageMainProps = {
  className: "page--main",
  component: "",
  sx: {
    // display: "flex",
    width: "100%",
    height: "100%",
    // flexFlow: "column nowrap",
    // justifyContent: "center",
    // padding: {
    //   xs: 0, // Padding is 1rem on small screens (mobile)
    //   sm: "2rem", // Padding is 2rem on medium/larger screens (tablet/desktop)
    //   md: "2.5rem", // Padding is 2rem on medium/larger screens (tablet/desktop)
    //   lg: "3rem", // Padding is 2rem on medium/larger screens (tablet/desktop)
    //   xl: "3.5rem", // Padding is 2rem on medium/larger screens (tablet/desktop)
    // },
    overflow: "scroll",
    // overflow: "hidden",
  },
};

//TODO: check if needed:
export const profileHeaderAvatarStyles = {
  className: "profileHeader--avatar",
  sx: {
    position: "absolute",
    zIndex: 10,
    width: "4rem",
    height: "4rem",
    bottom: 130,
    left: "2rem",
  },
};

//TODO: check if needed:
export const profileDescriptionTextStyles = {
  sx: {
    pl: "2rem",
  },
};
export const widgetContainerProps = {
  className: "widgetContainer",
  sx: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // p: "0.5rem",
    backgroundColor: "widget.background",
    overflow: "auto",
  },
};
export const containerProps = {
  className: "container",
  component: "",
  sx: {
    width: "100%",
    height: "100%",
    // display: "flex",
    // flexFlow: "column nowrap",
    // justifyContent: "center",
    // alignItems: "center",
    // flexShrink: 0,
    // m: 0,
    // p: 0,
  },
};

export const formProps = {
  className: "baseCrudForm",
  component: "form",
  sx: {
    width: "100%",
    // minWidth: {
    //   xs: "20ch",
    //   sm: "15ch",
    //   md: "15ch",
    // },
    // maxWidth: "50ch",
    mx: "auto",
    p: {
      xs: 2,
      sm: 2,
      md: 3,
      lg: 3,
      xl: 4,
    },
  },
};
export const formTitleProps = {
  variant: "h1",
  sx: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: 300,
    fontSize: {
      xs: "1.2rem",
      sm: "1.2rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "2rem",
    },
  },
};
export const formFieldsGroupProps = {
  className: "formfields--group",
  component: "",
  sx: { display: "flex", flexDirection: "column", gap: 2 },
};
export const formFieldProps = {
  variant: "outlined",
  sx: {
    // width: "100%",
    // display: "flex",
    // justifyContent: "flex-start",
    // fontWeight: 300,
    fontSize: {
      xs: "1.2rem",
      sm: "1.2rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "2rem",
    },
  },
};
export const titleProps = {
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

//* not needed yet:
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
//TODO: check if needed:
export const flexListStyles = {
  sx: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexGrow: 1,
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

export const subtitleProps = {
  variant: "body1",
  sx: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 1,
  },
};

export const dataGridImageCellStyles = {
  sx: {
    // width: "10px",
    // height: "auto",
    width: 100,
    // width: "100%",
    // height: 60,
    // height: "100%",
    // height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    align: "center",
    objectFit: "cover",
    borderRadius: "10px",
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: "#333433",
  },
};
export const sharedComponents = {
  MuiAppBar: {
    defaultProps: {
      // size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        // height: "fit-content",
        border: "none",
        borderRadius: 0,
        padding: 0,
        margin: 0,
      }),
    },
  },
  MuiNav: {
    defaultProps: {
      // size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        // height: "fit-content",
        padding: 0,
        margin: 0,
      }),
    },
  },
  MuiBottomNavigation: {
    defaultProps: {
      // size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        position: "relative",
        width: "100%",
        // height: footerHeight,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "background.nav",
        padding: 0,
        margin: 0,
      }),
    },
  },
  MuiToolbar: {
    defaultProps: {
      // size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        // height: "fit-content",
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
        margin: 0,
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
        // padding: "2rem",
        // backgroundColor: theme.palette.primary.dark,
      }),
    },
  },

  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        maxWidth: "50%",

        height: "100%",
        maxHeight: 350,
        display: "flex",
        // flex: "8 6 220px",

        flexFlow: "column nowrap",
        padding: 0,
        // m: 0,
        backgroundColor: theme.palette.card.background,

        // backgroundColor: {
        //   xs: theme.palette.secondary.main,
        //   lg: theme.palette.action.main,
        // },
        "&:hover": { backgroundColor: theme.palette.card.hover },
      }),
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "inherit",
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { zIndex: 1500, padding: 0, m: 0 },
      paperAnchorRight: ({ theme }) => ({
        width: "40%",

        // height: "80vh",
        // bottom: 0,
        display: "flex",
        justifyContent: "flex-start",
        overflowY: "hidden",
        // backgroundColor: "white",
      }),

      paperAnchorBottom: ({ theme }) => ({ padding: "3rem 1rem 0 1rem" }),
      paperAnchorLeft: ({ theme }) => ({
        width: "fit-content",

        // height: "80vh",
        // bottom: 0,
        display: "flex",
        justifyContent: "flex-start",
        overflowY: "hidden",
        // backgroundColor: "white",
        padding: "3rem 0 0 0",
        m: 0,
      }),
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& >*": { fontSize: 16 },
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
        fontSize: 24,
        fontWeight: "200",
        marginBottom: "1rem",
        textAlign: "center",
        // Example: Use a different color for light vs. dark mode
        color:
          theme.palette.mode === "dark"
            ? theme.palette.text.primary
            : theme.palette.text.dark,
      }),
      h5: {
        fontWeight: "bold",
        // marginTop: "2rem",
        marginBottom: "0.5rem",
      },
      subtitle1: {
        fontSize: 16,
        fontWeight: "100",
        lineHeight: 1.6,
        padding: "8px",
      },
      subtitle2: {
        fontSize: 14,
        fontWeight: "100",
        lineHeight: 0,
        padding: "0",
      },
      body1: {
        fontSize: 12,
        fontWeight: "100",
        lineHeight: 1.6,
        padding: "8px",
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
        width: 56,
        height: 56,
      }),
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: ({ theme }) => ({
        backgroundColor: theme.palette.button.active,
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

  MuiDataGrid: {
    defaultProps: {
      slotProps: {
        // "menu" targets the Column Menu (sort, hide, etc.)
        menu: {
          sx: {
            // This creates a specific selector for Lists inside DataGrid Menus
            "& .MuiList-root": {
              backgroundColor: "steelblue",
              // Your custom styles:
              display: "flex",
              flexDirection: "row",
            },
          },
        },
        // "panel" targets the Filter Panel (if you need that too)
        panel: {
          sx: {
            "& .MuiList-root": {
              backgroundColor: "steelblue",
              // Your custom styles:
              display: "flex",
              flexDirection: "row",
              // Apply similar styles here if needed
            },
          },
        },
        // 1. Target the Pagination Slot
        pagination: {
          pageSizeOptions: [5, 10, 25, 50, 100],
          sx: {
            "& .MuiInputBase-root": {
              backgroundColor: "red",
            },
            "& .MuiList-root": {
              backgroundColor: "steelblue",
              // Your custom styles:
              display: "flex",
              flexDirection: "row",
            },
          },
          // 2. Pass props to the MuiSelect component inside Pagination
          SelectProps: {
            // 3. Pass props to the Menu (Popover) that the Select opens
            MenuProps: {
              // 4. Use SX to target the List inside that specific Menu
              sx: {
                "& .MuiList-root": {
                  backgroundColor: "steelblue", // Your custom color
                  display: "flex",
                  flexDirection: "column",

                  // Optional: Style the specific items
                  "& .MuiMenuItem-root": {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkblue",
                    },
                  },
                },
                // If you need to style the Paper (the container of the list)
                "& .MuiPaper-root": {
                  backgroundColor: "steelblue",
                },
              },
            },
          },
        },
      },
    },
    styleOverrides: {
      row: ({ theme }) => ({
        // backgroundColor: "#9ccae9ff",
        "&:hover": {
          // backgroundColor: theme.palette.action.dark,
        },
      }),
      topContainer: ({ theme }) => ({
        display: "flex",
        justifyContent: "space-between",
        "&:hover": { backgroundColor: "#333433" },
      }),
      toolbar: ({ theme }) => ({
        display: "flex",
        justifyContent: "space-between",
        "&:hover": { backgroundColor: "#333433" },
      }),
      main: ({ theme }) => ({
        backgroundColor: theme.palette.datagrid.main,
      }),
      columnHeader: ({ theme }) => ({
        // border: "none",
        //         display: "flex",
        //         justifyContent: "space-between",
        //         alignItems: "center",
        backgroundColor: theme.palette.bars.tool,
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          // border: "none",
          //         display: "flex",
          //         justifyContent: "space-between",
          //         alignItems: "center",
          backgroundColor: theme.palette.datagrid.columnHeader,
        },
        "& .MuiDataGrid-columnHeader": {
          // border: "none",
          //         display: "flex",
          //         justifyContent: "space-between",
          //         alignItems: "center",
          backgroundColor: theme.palette.datagrid.columnHeader,
        },
        "& .MuiDataGrid-columnSeparator": {
          ...theme.palette.datagrid.border,
          //         // width: "100%",
          // color: theme.palette.datagrid.borderColor,
        },
        "& .MuiDataGrid-columnSeparator > *": {
          //         // width: "100%",
          // color: "#fff",
          backgroundColor: theme.palette.datagrid.columnHeader,
        },
        "& .MuiDataGrid-columnHeaderTitleContainer > svg": {
          backgroundColor: "steelblue",
          //         // width: "100%",
          //         color: "#fff",
          // backgroundColor: "#333433",
          //         "&:hover": {
          //           color: "white",
          //           backgroundColor: "steelblue",
          //         },
        },
      }),
      footerContainer: ({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.datagrid.footerContainer,
      }),
      sortButton: ({ theme }) => ({
        color: theme.palette.button.active,
      }),
      "& .MuiList": {
        width: "5rem",
        minWidth: null,
        backgroundColor: "steelblue",
      },

      root: ({ theme }) => ({
        ...theme.palette.datagrid,
        border: "none",
        // width: "100%",
        // height: "100%",
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
        // "& .MuiDataGrid-toolbar": {
        //   display: "flex",
        //   justifyContent: "space-between",
        //   "&:hover": { backgroundColor: "#333433" },
        // },
        //       border: "none",
        "& .MuiDataGrid-topContainer": {
          //         // height: "100%",
          //         color: "#fff",
          //         backgroundColor: "#333433",
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
          border: "none",
          //         height: "100%",
        },
        "& .MuiDataGrid-root--densityComfortable": {
          // border: "none",
          //         outline: "none",
        },
        "& .MuiDataGrid-withBorderColor > *": {
          // backgroundColor: "steelblue",
          // border: "none",
          //         outline: "none",
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

        "& .MuiDataGrid-iconButtonContainer > *": {
          //         width: "1rem",
          //         height: "1rem",
          //         color: "white",
          //         backgroundColor: "steelblue",
        },
        "& .MuiDataGrid-menuIcon, & .MuiDataGrid-menuIcon > *": {
          // border: "none",
          //         color: "#fff",
          //         outline: "none",
        },
        "& .MuiDataGrid-cell": {
          position: "relative",
          color: "#aaa",
          outline: "none",
          userSelect: "none",
          ...theme.palette.datagrid,
        },
        "& .MuiDataGrid-cell--accordion": {
          padding: 0,
          overflow: "visible !important",
        },
        "& .MuiDataGrid-cell:active": {
          outline: "none",
        },
        "& .MuiDataGrid-cell:focus": {
          color: "#fff",
          outline: "none",
        },
        "& .MuiDataGrid-cell:hover": {
          color: "#fff",
        },

        "& .MuiTablePagination-select .MuiInputBase-root": {
          width: "5rem",
          backgroundColor: "white",
        },
      }),
    },
  },
};
