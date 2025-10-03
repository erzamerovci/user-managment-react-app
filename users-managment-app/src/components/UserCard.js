import { Card, CardContent, Typography, Avatar, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UserCard({ user }) {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                height: 150,
                width: 350,
                mt: 7
            }}
            onClick={() => navigate(`/users/${user.id}`)}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                        {user.name[0]}
                    </Avatar>
                    <div>
                        <Typography variant="h5" >{user.name}</Typography>
                        <Typography color="text.secondary">{user.email}</Typography>
                        <Typography variant="body2">{user.company.name}</Typography>
                    </div>
                </Stack>
            </CardContent>
        </Card>
    );
}