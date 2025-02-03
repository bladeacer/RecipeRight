import {Box, Typography} from '@mui/material';
import UserContext from "../contexts/UserContext";
import {useContext} from 'react';

export default function Home() {
    const {user} = useContext(UserContext);
    return (

        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {!user && (

            <Typography variant="h5" sx={{ my: 2 }}>
                Login to get started!
            </Typography>
            )}
            {user && (

            <Typography variant="h5" sx={{ my: 2 }}>
                Welcome back, {user.name}
            </Typography>
            )}
        </Box>
    )
}