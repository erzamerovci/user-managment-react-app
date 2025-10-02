import { useState, useEffect } from "react";
import { getAllUsers } from "../services/getAllUsers";
import UserCardList from "../components/UserCardList";
import { TextField, Container, Typography } from "@mui/material";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchData() {
            const data = await getAllUsers();
            setUsers(data);
        }
        fetchData();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>User Directory</Typography>
            <TextField
                label="Search by name or email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {filteredUsers.length ? (
                <UserCardList users={filteredUsers} />
            ) : (
                <Typography sx={{ mt: 2 }}>No users found.</Typography>
            )}
        </Container>
    );
}