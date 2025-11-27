import React from "react";
import { IconButton } from "@mui/material";
import {
    Add,
    Edit,
    Favorite,
    Public,
    PublicOff,
    Share,
} from "@mui/icons-material";

import { useData } from "@/context/DataContext";
import { useUi } from "@/context/UiContext";
import KebabMenu from "@/components/menus/KebabMenu";
import ShareButton from "@/components/share/ShareButton";
import ImageCell from "@/components/dataGridElements/ImageCell";
import { formatShortTime } from "@/hooks/useRelativeTime";

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

export function useFileConfig({
    handleClickEdit,
    setFilteredData,
    setGenreInFocus,
    onItemClick,
    schemeDefinition,
    data,
}) {
    const { handleTogglePublishProject } = useData(); // Assuming files use the same toggle or similar
    const { isMobile, showCardMedia } = useUi();

    // --- Card Actions ---
    const getCardActions = (episode) => {
        const emailSubject = `Check out this article: ${episode.title || "File"}`;
        const emailBody = `Hey, check this out.`;

        const kebabActions = [
            {
                id: "edit",
                name: "Edit Episode",
                icon: <Edit />,
                action: () => handleClickEdit(episode),
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
            </>
        );

        return {
            showCardMedia: showCardMedia,
            schemeDefinition,
            handleClickAvatar: (item) => console.log("item", item),
            handleClickTitle: (item) => onItemClick(item),
            handleClickSubTitle: (item) => {
                const filtered = data.filter((project) =>
                    project.genres.some((g) => g.genre === item.genre)
                );
                setFilteredData(filtered);
                setGenreInFocus(item.genre);
            },
            subTitleInFocus: null,
            headerActions: <KebabMenu actions={kebabActions} />,
            actions: footerActions,
        };
    };

    // --- DataGrid Columns ---
    const columns = [
        {
            field: "avatarUrl",
            headerName: "",
            align: dataGridImageCellStyles.sx.align,
            width: dataGridImageCellStyles.sx.width,
            renderCell: (params) => {
                const { avatarUrl } = params.row;
                return (
                    <ImageCell
                        avatarUrl={avatarUrl}
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
            field: "fileName",
            headerName: "Title",
            width: 300,
            flex: 1,
            disableColumnMenu: isMobile && true,
        },
        {
            field: "filePurpose",
            headerName: "Purpose",
            align: "left",
            width: 100,
            flex: 1,
            disableColumnMenu: isMobile && true,
        },
        {
            field: "status",
            headerName: "Status",
            align: "center",
            width: 100,
            disableColumnMenu: isMobile && true,
        },
        {
            field: "createdAt",
            headerName: "Uploaded",
            align: "center",
            width: isMobile ? 40 : 80,
            renderCell: (params) => {
                const relativeCreatedTime = formatShortTime(params.row.createdAt);
                return <>{relativeCreatedTime} ago</>;
            },
            disableColumnMenu: isMobile && true,
        },
    ];

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
        columns,
        rowActions,
    };
}
