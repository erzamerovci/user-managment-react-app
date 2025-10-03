import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUsers, addUser, updateUser, deleteUser } from "../redux/usersSlice";
import { getAllUsers } from "../services/getAllUsers";
import UserCardList from "../components/UserCardList";
import {
    TextField, Container, Typography, Box, Button, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select, MenuItem,
    IconButton,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import Spinner from "../components/Spinner";

export default function UserList() {
    // const [users, setUsers] = useState([]);
    const users = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [sortDirection, setSortDirection] = useState("asc");
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
            const datafromApi = await getAllUsers();
            const datafromLocalStorage = JSON.parse(localStorage.getItem("localUsers") || "[]").reverse();
            dispatch(setUsers([...datafromLocalStorage, ...datafromApi]));
            setLoading(false);
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
    const handleAddUser = (e) => {
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

        dispatch(addUser(usertoAdd));
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
    const sortedUsers = sortBy === "default"
        ? filteredUsers
        : [...filteredUsers].sort((a, b) => {
            let compare = 0;
            if (sortBy === "name") compare = a.name.localeCompare(b.name);
            if (sortBy === "email") compare = a.email.localeCompare(b.email);
            if (sortBy === "company") compare = a.company.name.localeCompare(b.company.name);
            return sortDirection === "asc" ? compare : -compare;
        });

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Users Managment App</Typography>
            <Box sx={{ mb: 2, textAlign: "right" }}>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Add User
                </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                    label="Search by name or email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                />
                <Select value={sortBy || ""} onChange={(e) => setSortBy(e.target.value)} displayEmpty>
                    <MenuItem value="default">SORT</MenuItem>
                    <MenuItem value="name">Sort by Name</MenuItem>
                    <MenuItem value="email">Sort by Email</MenuItem>
                    <MenuItem value="company">Sort by Company</MenuItem>
                </Select>
                <IconButton onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
                    {sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                </IconButton>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add a New User</DialogTitle>
                {/* <DialogContent> */}
                <Box
                    component="form"
                    onSubmit={handleAddUser}
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        mt: 1,
                        px: 3,
                        pb: 2
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
                    <DialogActions sx={{ gridColumn: "1 / -1" }}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
            {loading ? (
                <Spinner />
            ) : sortedUsers.length ? (
                <UserCardList users={sortedUsers} />
            ) : (
                <Typography sx={{ mt: 2 }}>No users found.</Typography>
            )}


        </Container>
    );
}