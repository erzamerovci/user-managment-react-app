import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "../services/getAllUsers";
import { Card, CardContent, Typography, Grid, Container } from "@mui/material";

export default function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const data = await getAllUsers();
            const found = data.find((u) => u.id === parseInt(id))
            setUser(found);
        }
        fetchData();
    }, [id])

    if (!user) return <p>Loading data...</p>

    return (
        <Container sx={{ mt: 4 }}>
            <Card sx={{ maxWidth: 600, margin: "0 auto", padding: 2, boxShadow: 4 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{user.name}</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography><strong>Email:</strong>{user.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><strong>Phone:</strong>{user.phone}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><strong>Website:</strong>{user.website}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography> <strong>Address:</strong>{user.address.street}, {user.address.city}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    )
}