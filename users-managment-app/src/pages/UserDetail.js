import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "../services/getAllUsers";
import { Typography } from "@mui/material";

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
        <div>
            <Typography variant="h4">{user.name}</Typography>
            <Typography>Email:{user.email}</Typography>
            <Typography>Phone:{user.phone}</Typography>
            <Typography>Website:{user.website}</Typography>
            <Typography>
                Address: {user.address.street}, {user.address.city}
            </Typography>
        </div>
    )
}