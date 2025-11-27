import React from "react";
import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import CrudItem from "../crudItem";

export const useWidgetHandlers = ({
  widgetConfig,
  setItemInFocus,
  setEditInFocus,
  setSelectInFocus,
  navigateTo,
}) => {
  const { setAppContext } = useApp();
  const { setOpenModal, setModalContent } = useUi();

  const handleAddItem = () => {
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="create" />
    );
    setOpenModal(true);
  };

  const handleClickEdit = (item) => {
    const setter = setEditInFocus || setItemInFocus;
    if (setter) setter(item);
    setModalContent(
      <CrudItem context={widgetConfig.collection} crud="update" />
    );
    setOpenModal(true);
  };

  const handleItemClick = (item) => {
    setAppContext(widgetConfig.context);
    const setter = setSelectInFocus || setItemInFocus;
    if (setter) setter(item);

    if (navigateTo && typeof navigateTo === "function") {
      navigateTo(item);
    }
  };

  const handleRowClick = (params, event) => {
    event.defaultMuiPrevented = true;
    handleItemClick(params.row);
  };

  return {
    handleAddItem,
    handleClickEdit,
    handleItemClick,
    handleRowClick,
  };
};
