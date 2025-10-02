import { useState, useEffect } from "react";
import { getAllUsers } from "../services/getAllUsers";
import UserCardList from "../components/UserCardList";
import { TextField } from "@mui/material";

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
        <div>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <UserCardList users={filteredUsers} />
        </div>
    );
}