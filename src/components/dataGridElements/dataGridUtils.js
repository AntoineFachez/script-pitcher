// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/DATAGRIDELEMENTS/DATAGRIDUTILS.JS

import { useMemo } from "react";
import RelativeTimeCell from "./RelativeTimeCell";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { ExpandMore, Public, PublicOff } from "@mui/icons-material";
import Image from "next/image";
import { getButton } from "@/lib/maps/iconMap";
import { stringAvatar } from "@/utils/colorHelpers";

export const useDataGridRowsAndColumns = (data, columns, rowActions) => {
  // 1. Transform the data object into an array of rows
  const rows = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    return Object.entries(data).map(([key, value]) => {
      return {
        id: key,
        collection: key,
        rowHeightValue: value === "The Showrunner" ? 200 : 200,

        ...value,
      };
    });
  }, [data]);

  // 2. Add the custom renderCell to the existing lastUpdated column
  const baseColumns = useMemo(() => {
    return columns.map((col) => {
      if (col.field === "lastUpdated" || col.field === "lastLogin") {
        return {
          ...col,
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            if (!params.value) return;
            <RelativeTimeCell firestoreTimestamp={params.value} />;
          },
        };
      } else if (col.field === "imageUrl") {
        return {
          ...col,
          renderCell: (params) => {
            return (
              <Box>
                {params.value && (
                  <>
                    <Image
                      fill
                      src={params.value}
                      alt={params.value}
                      style={{ objectFit: "cover" }}
                    />
                    {/* <Avatar
                onClick={() => handleClickAvatar(item)}
                sx={{}}
                src={item[schemeDefinition?.avatarUrl]}
                {...stringAvatar(item[schemeDefinition?.title] || "N/A")}
              /> */}
                  </>
                )}
              </Box>
            );
          },
        };
      } else if (col.field === "published") {
        return {
          ...col,
          // flex: 1,
          // minWidth: 150,
          renderCell: (params) => {
            return (
              <>
                {getButton(
                  null,
                  params.value ? "Public" : "PublicOff",
                  () => console.log("clicked"),
                  null,
                  params.value ? { color: "success.main" } : {}
                )}
              </>
            );
          },
        };
      } else if (col.field === "userActive") {
        return {
          ...col,
          // flex: 1,
          // minWidth: 150,
          renderCell: (params) => {
            return (
              <>
                {getButton(
                  null,
                  params.value ? "Person" : "PersonOff",
                  (e) => {
                    e.stopPropagation();
                    return console.log("clicked");
                  },
                  null,
                  params.value ? { color: "success.main" } : {}
                )}
              </>
            );
          },
        };
      } else if (col.field === "genres") {
        return {
          ...col,
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            const genresArray = params.value;

            if (
              !genresArray ||
              !Array.isArray(genresArray) ||
              genresArray.length === 0
            ) {
              return null;
            }

            const genreNames = genresArray.map((item) => item.genre);

            return <span>{genreNames.join(", ")}</span>;
          },
        };
      } else if (col.field === "roles") {
        return {
          ...col,
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            const rolesArray = params.value;

            if (
              !rolesArray ||
              !Array.isArray(rolesArray) ||
              rolesArray.length === 0
            ) {
              return null;
            }

            const roleNames = rolesArray.map((item) => item.role);

            return <span>{roleNames.join(", ")}</span>;
          },
        };
      } else if (col.field === "accordion") {
        return {
          ...col,
          cellClassName: "MuiDataGrid-cell--accordion",
          renderCell: (params) => {
            return (
              <>
                <Accordion
                  sx={{ width: "100%", height: "100%", boxShadow: "none" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span">Accordion 1</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </AccordionDetails>
                </Accordion>
              </>
            );
          },
        };
      }
      return col;
    });
  }, [columns]);

  // 3. Append the actions column
  const columnsWithActions = useMemo(() => {
    const actionsColumn = {
      field: "actions",
      headerName: rowActions?.header || "Actions",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return rowActions?.menu(params.row);
      },
    };

    return [...baseColumns, actionsColumn];
  }, [baseColumns, rowActions]);

  return { rows, columnsWithActions };
};
