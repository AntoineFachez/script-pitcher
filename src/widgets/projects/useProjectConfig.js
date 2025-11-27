import React from "react";
import { IconButton } from "@mui/material";
import { Public, PublicOff, Favorite, Share, Edit } from "@mui/icons-material";

import { useData } from "@/context/DataContext";
import { useUi } from "@/context/UiContext";
import KebabMenu from "@/components/menus/KebabMenu";
import ShareButton from "@/components/share/ShareButton";
import ImageCell from "@/components/dataGridElements/ImageCell";

const dataGridImageCellStyles = {
    sx: {
        width: 100,
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

export function useProjectConfig({
    onEditProject,
    onSetGenreFocus,
    onItemClick,
    schemeDefinition,
}) {
    const { handleTogglePublishProject } = useData();
    const { isMobile, showCardMedia } = useUi();

    // --- Card Actions ---
    const getCardActions = (project) => {
        const emailSubject = `Check out this project`;
        const emailBody = `Hey, I wanted you to see this project.`;

        const kebabActions = [
            {
                id: "edit",
                name: "Edit Project",
                icon: <Edit />,
                action: () => onEditProject(project),
            },
            {
                id: "publishProject",
                name: project.published ? "Hide Project" : "Publish Project",
                icon: project.published ? <Public /> : <PublicOff />,
                sx: project.published ? { color: "success.main" } : { color: "#aaa" },
                action: () => handleTogglePublishProject(project.id, project.published),
            },
        ];

        const footerActions = (
            <>
                <IconButton aria-label="add to favorites">
                    <Favorite />
                </IconButton>
                <ShareButton
                    recipient="friend@example.com"
                    subject={emailSubject}
                    body={emailBody}
                >
                    <Share />
                </ShareButton>
                <IconButton
                    aria-label="publish"
                    onClick={() =>
                        handleTogglePublishProject(project.id, project.published)
                    }
                    sx={{ color: project?.published ? "success.main" : "inactive.main" }}
                >
                    {project?.published ? <Public /> : <PublicOff />}
                </IconButton>
            </>
        );

        return {
            showCardMedia: showCardMedia,
            schemeDefinition,
            handleClickAvatar: (item) => console.log("Avatar clicked:", item),
            handleClickTitle: (item) => onItemClick(item),
            handleClickSubTitle: (item) => onSetGenreFocus(item.genre),
            subTitleInFocus: null, // Passed from parent if needed
            headerActions: <KebabMenu actions={kebabActions} />,
            actions: footerActions,
        };
    };

    // --- DataGrid Columns ---
    const columns = [
        {
            field: "bannerUrl",
            headerName: "",
            align: dataGridImageCellStyles.sx.align,
            width: dataGridImageCellStyles.sx.width,
            renderCell: (params) => {
                const { bannerUrl } = params.row;
                return (
                    <ImageCell
                        url={bannerUrl}
                        dataGridImageCellStyles={dataGridImageCellStyles}
                    />
                );
            },
            disableColumnMenu: true,
        },
        {
            field: "published",
            headerName: "Published",
            align: "center",
            width: isMobile ? 40 : 80,
            renderCell: (params) => {
                const { id, published } = params.row;
                return (
                    <IconButton
                        aria-label="publish"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.defaultMuiPrevented = true;
                            handleTogglePublishProject(id, published).catch((err) => {
                                console.error("Failed to toggle from widget", err);
                            });
                        }}
                        color={published ? "success" : "default"}
                    >
                        {published ? <Public /> : <PublicOff />}
                    </IconButton>
                );
            },
            disableColumnMenu: isMobile && true,
        },
        {
            field: "title",
            headerName: "Title",
            flex: 1,
            width: 130,
            disableColumnMenu: isMobile && true,
        },
        {
            field: "genres",
            headerName: "Genres",
            align: "center",
            width: 100,
            disableColumnMenu: isMobile && true,
        },
    ];

    const visibleColumns = columns.filter(Boolean);

    // --- Row Actions ---
    const rowActions = {
        header: "",
        width: 40,
        disableColumnMenu: true,
        menu: (param) => {
            const actions = [
                {
                    id: "addDocument",
                    name: "Add Document",
                    icon: "Add",
                    action: () => console.log("handleOpenForm(param.collection)"),
                },
                {
                    id: "deleteCollection",
                    name: "Delete Collection",
                    icon: "Delete",
                    action: () => console.log("handleDeleteCollection(param.collection)"),
                },
                {
                    id: "publishProject",
                    name: param.published ? "Hide Project" : "Publish Project",
                    icon: param.published ? "Public" : "PublicOff",
                    sx: param.published ? { color: "success.main" } : { color: "#aaa" },
                    action: () => {
                        return handleTogglePublishProject(param.id, param.published).catch(
                            (err) => {
                                console.error("Failed to toggle from widget", err);
                            }
                        );
                    },
                },
            ];
            return <KebabMenu actions={actions} />;
        },
    };

    return {
        getCardActions,
        columns: visibleColumns,
        rowActions,
    };
}
