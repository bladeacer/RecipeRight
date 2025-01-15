import { Box, Typography } from '@mui/material';
import UserContext from "../contexts/UserContext";
import { useContext } from 'react';

export default function Home() {
    const { user } = useContext(UserContext);
    return (

        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {!user && (
                <>
                    <h2>Login to get started</h2>
                    <blockquote>
                        This is a simple recipe generation application.
                        <footer>
                            <cite>- bladeacer, 2025</cite>
                        </footer>
                    </blockquote>
                </>
            )}
            {user && (
                <h5>Welcome back, {user.name}</h5>
            )}
        </Box>
    )
}