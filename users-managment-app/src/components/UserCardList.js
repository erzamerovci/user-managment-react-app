
import { Grid } from '@mui/material';
import UserCard from './UserCard';

export default function UserCardList({ users }) {
    return (
        <Grid container spacing={2} justifyContent={"center"}>
            {users.map(user => (
                <Grid item xs={12} sm={6} md={3} key={user.id}>
                    <UserCard user={user} />
                </Grid>
            ))}
        </Grid>
    )
}