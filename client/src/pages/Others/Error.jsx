import { Box } from '@mui/material';


export default function Error() {
    return (

        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div>
                <h3>Unexpected Error</h3>
                <p>You may not have permission to view this page.</p>
                <p>Click <a href="/">here to</a> go back to home</p>
            </div>
        </Box>
    );
}