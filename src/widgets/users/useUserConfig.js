import React from "react";
import { IconButton, Chip } from "@mui/material";
import { Favorite, Share, Person, PersonOff, Edit } from "@mui/icons-material";

import KebabMenu from "@/components/menus/KebabMenu";
import ShareButton from "@/components/share/ShareButton";
import ImageCell from "@/components/dataGridElements/ImageCell";
import RelativeTimeCell from "@/components/timeCells/RelativeTimeCell";

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

const subtitleProps = {
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

export function useUserConfig({
    handleClickEdit,
    handleToggleActiveUser,
    handleClickSubTitle,
    onItemClick,
    roleInFocus,
    schemeDefinition,
    isMobile,
}) {
    // --- Card Actions ---
    const getCardActions = (user) => {
        const emailSubject = `Check out this user`;
        const emailBody = `Hey, I wanted you to see this user profile.`;

        const kebabActions = [
            {
                id: "edit",
                name: "Edit User",
                icon: <Edit />,
                action: () => handleClickEdit(user),
            },
            {
                id: "toggleActive",
                name: user.userActive ? "Deactivate" : "Activate",
                icon: user.userActive ? <Person /> : <PersonOff />,
                action: () => handleToggleActiveUser(user),
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
                    aria-label="toggle active"
                    onClick={() => handleToggleActiveUser(user)}
                    sx={{
                        color: user?.userActive ? "success.main" : "warning.main",
                    }}
                >
                    {user?.userActive ? <Person /> : <PersonOff />}
                </IconButton>
            </>
        );

        const customSubTitleItem = user.roles?.map((role) => (
            <Chip
                {...subtitleProps}
                key={role.role}
                label={role.role}
                onClick={() => handleClickSubTitle(role)}
            />
        ));

        return {
            showCardMedia: false, // Users don't have media
            schemeDefinition,
            handleClickAvatar: (item) => console.log("Avatar clicked:", item),
            handleClickTitle: (item) => onItemClick(item),
            handleClickSubTitle: (item) => console.log("Subtitle clicked:", item),
            subTitleInFocus: roleInFocus,
            customSubTitleItem,
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
                        url={avatarUrl}
                        dataGridImageCellStyles={dataGridImageCellStyles}
                    />
                );
            },
            disableColumnMenu: true,
        },
        {
            field: "userActive",
            headerName: "Active",
            align: "center",
            width: isMobile ? 40 : 80,
            disableColumnMenu: isMobile && true,
        },
        {
            field: "displayName",
            headerName: "user",
            align: "left",
            flex: 1,
            width: 100,
            disableColumnMenu: isMobile && true,
        },
        {
            field: "company",
            headerName: "Company",
            align: "left",
            flex: 1,
            width: 100,
            disableColumnMenu: isMobile && true,
        },
        {
            field: "role",
            headerName: "Role",
            align: "left",
            width: 60,
            flex: 1,
            renderCell: (params) => {
                const { role } = params.row;
                return <>{role?.role}</>;
            },
            disableColumnMenu: isMobile && true,
        },
        !isMobile && {
            field: "joinedAt",
            headerName: "joined Team",
            align: "center",
            width: isMobile ? 40 : 80,
            renderCell: (params) => {
                const { role } = params.row;
                return (
                    <>
                        <RelativeTimeCell value={role?.joinedAt} /> ago
                    </>
                );
            },
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
