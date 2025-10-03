import { CircularProgress, Box } from "@mui/material";

export default function Spinner() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
        </Box>
    );
}