import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router';
import { isExpired } from 'react-jwt'


interface Props{
    name?: string;
}
export default function Header(props:Props) {
    const history=useHistory();
    const user:string|null=localStorage.getItem('User');

    const token:string|null=localStorage.getItem('access_token');
    if(props.name!="Login" && (token==null||isExpired(token))){
        localStorage.removeItem("access_token");
        localStorage.removeItem("User");
        history.push("/login");
    }

    const Logout=()=>{
        localStorage.removeItem("access_token");
        localStorage.removeItem("User");
        history.push("/login");
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        {props.name}
                    </Typography>
                    <Button variant="text" style={{marginLeft: 'auto', color: '#fff'}} onClick={()=>history.push("/")}>
                        {user}
                    </Button>
                    {user &&
                    <Button variant="contained" color="secondary" onClick={Logout}>
                        Logout
                    </Button>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}