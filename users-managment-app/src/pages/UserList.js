import { useState, useEffect } from "react";
import { getAllUsers } from "../services/getAllUsers";
import UserCardList from "../components/UserCardList";
import {
    TextField, Container, Typography, Paper, Box, Button, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        website: "",
        street: "",
        city: "",
        company: ""
    })
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            const datafromApi = await getAllUsers();
            const datafromLocalStorage = JSON.parse(localStorage.getItem("localUsers") || "[]");
            setUsers([...datafromLocalStorage, ...datafromApi]);
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    }

    const validateForm = () => {
        let formErrors = {};
        if (!newUser.name) formErrors.name = "Name is required";
        if (!newUser.email.trim()) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            formErrors.email = "Email is invalid";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }
    const addUser = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const maxId = users.length ? Math.max(...users.map(u => u.id)) : 0;
        const usertoAdd = {
            id: maxId + 1,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            website: newUser.website,
            address: {
                street: newUser.street,
                city: newUser.city
            },
            company: {
                name: newUser.company
            }
        };

        setUsers([usertoAdd, ...users]);
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        localUsers.push(usertoAdd);
        localStorage.setItem("localUsers", JSON.stringify(localUsers));
        setNewUser({
            name: "",
            email: "",
            phone: "",
            website: "",
            street: "",
            city: "",
            company: ""
        });
        setErrors({});
        setOpen(false);
    }

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Users Managment App</Typography>
            <Box sx={{ mb: 2, textAlign: "right" }}>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Add User
                </Button>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add a New User</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={addUser}
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            mt: 1
                        }}
                    >
                        <TextField
                            label="Name"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            required
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            value={newUser.phone}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Website"
                            name="website"
                            value={newUser.website}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Street"
                            name="street"
                            value={newUser.street}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="City"
                            name="city"
                            value={newUser.city}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Company"
                            name="company"
                            value={newUser.company}
                            onChange={handleInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={addUser} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

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