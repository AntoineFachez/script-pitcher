import { useRef, useState } from "react";
import {
  Add,
  FilterList,
  ReplayOutlined,
  Search,
  ViewColumn,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  Badge,
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FilterPanelTrigger,
  Toolbar,
  useGridRootProps,
  useGridApiContext,
  ToolbarButton,
  ColumnsPanelTrigger,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from "@mui/x-data-grid";
import { getButton } from "@/lib/maps/iconMap";

import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [newPanelOpen, setNewPanelOpen] = useState(false);
  const newPanelTriggerRef = useRef(null);

  const handleClose = () => {
    setNewPanelOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    apiRef.current.updateRows([
      {
        id: randomId(),
        commodity: formData.get("commodity"),
        quantity: Number(formData.get("quantity")),
        unitPrice: Number(formData.get("unitPrice")),
      },
    ]);
    handleClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };
  const StyledQuickFilter = styled(QuickFilter)({
    display: "grid",
    alignItems: "center",
    marginLeft: "auto",
  });

  const StyledToolbarButton = styled(ToolbarButton)(
    ({ theme, ownerState }) => ({
      gridArea: "1 / 1",
      width: "min-content",
      height: "min-content",
      zIndex: 1,
      opacity: ownerState.expanded ? 0 : 1,
      pointerEvents: ownerState.expanded ? "none" : "auto",
      transition: theme.transitions.create(["opacity"]),
    })
  );

  const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    overflowX: "clip",
    width: ownerState.expanded ? 260 : "var(--trigger-width)",
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(["width", "opacity"]),
  }));
  return (
    <Toolbar>
      <Tooltip title="Add new commodity">
        <ToolbarButton
          ref={newPanelTriggerRef}
          aria-describedby="new-panel"
          onClick={() => setNewPanelOpen((prev) => !prev)}
        >
          <Add fontSize="small" />
        </ToolbarButton>
      </Tooltip>
      <Popper
        open={newPanelOpen}
        anchorEl={newPanelTriggerRef.current}
        placement="bottom-end"
        id="new-panel"
        onKeyDown={handleKeyDown}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 300,
              p: 2,
            }}
            elevation={8}
          >
            <Typography fontWeight="bold">Add new commodity</Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Commodity"
                  name="commodity"
                  size="small"
                  autoFocus
                  fullWidth
                  required
                />
                <TextField
                  label="Quantity"
                  type="number"
                  name="quantity"
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="Price"
                  type="number"
                  name="unitPrice"
                  size="small"
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" fullWidth>
                  Add Commodity
                </Button>
              </Stack>
            </form>
          </Paper>
        </ClickAwayListener>
      </Popper>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumn fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge
                badgeContent={state.filterCount}
                color="primary"
                variant="dot"
              >
                <FilterList fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>{" "}
      <StyledQuickFilter>
        {" "}
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <Search fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

const GridCustomToolbar = ({
  syncState,
  isExpandedTable,
  setIsExpandedTable,
}) => {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <Toolbar>
      {" "}
      <Box>
        {/**
        i,
        iconName = "",
        onClick,
        disabled = false,
        sx = iconButtonStyles.sx,
        variant = "outlined",
        href = null,
        label = "",
        asNavigationAction = false,
        asTextButton = false,
        startIcon = null
       */}
        {getButton(
          null,
          isExpandedTable ? "DensityMedium" : "DensitySmall",
          () => setIsExpandedTable((prev) => !prev),
          false,
          {},
          null,
          null,
          null,
          null,
          null,
          null
        )}
      </Box>
      <ColumnsPanelTrigger />
      <FilterPanelTrigger />
      {/* <GridToolbarExportContainer /> */}
      <CustomToolbar />
      <IconButton
        size="small"
        // startIcon={<rootProps.slots.columnSelectorIcon />}
        onClick={() => console.log("clicked ReplayOutlined")}
        {...rootProps.slotProps?.baseButton}
      >
        <ReplayOutlined />
      </IconButton>
    </Toolbar>
  );
};
export default GridCustomToolbar;
