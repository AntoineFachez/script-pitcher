export const formProps = {
    className: "baseCrudForm",
    component: "form",
    sx: {
        width: "100%",
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
    component: "div", // Changed from "" to "div" for valid React component
    sx: { display: "flex", flexDirection: "column", gap: 2 },
};

export const formFieldProps = {
    variant: "outlined",
    sx: {
        fontSize: {
            xs: "1.2rem",
            sm: "1.2rem",
            md: "1.5rem",
            lg: "2rem",
            xl: "2rem",
        },
    },
};
