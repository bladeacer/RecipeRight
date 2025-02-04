import { useEffect, useState } from "react";
import { Box } from '@mui/material';

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export default function Error() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        delay(1000);
        setLoading(false);
    }, []);
    return (
        loading ?

        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h3 aria-busy="true"> Loading...</h3>
        </Box>
            :
            <div>
                <h3>Unexpected Error</h3>
                <p>You may not have permission to view this page.</p>
                <p>Click <a href="/">here to</a> go back to home</p>
            </div>
    );
}