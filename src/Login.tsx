import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import Header from './Header'
import './Login.css'
import {isExpired} from 'react-jwt'

import { Paper, TextField, Box,Typography, Button } from '@material-ui/core'

const API_URL: string|undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

function Login() {
    const [message, setMessage] = useState<string>('');
    const [user, setUser] = useState<string>('');
    const [PW, setPW] = useState<string>('');

    const token:string|null=localStorage.getItem('access_token');
    const [isLoggedin,setIsLoggedin]=useState<boolean>(token!=null && !isExpired(token));

    const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value);
    }
    const changePW = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPW(event.target.value);
    }
    const handleAuth = () => {
        let data = { "id": user, "pw": PW };
        axios.post(API_URL + "/auth/login", JSON.stringify(data)).then(res => {
            let d=JSON.parse(JSON.stringify(res.data));
            localStorage.setItem("access_token",d.access_token);
            localStorage.setItem("User", user);
            setIsLoggedin(true);
        }).catch(error => {
            setUser("");
            setPW("");
            setMessage("Authentication failed");
            alert(error);
        })
    }
    return (
        <div>
            <Header name="Login" />
            {isLoggedin && <Redirect to="/" />}
            <div>
                <Paper elevation={3} className="login-paper">
                    <Box className="login-box">
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <Typography component="h6" style={{color: 'red'}}>{message}</Typography>
                        <TextField required value={user} label="Username" onChange={changeUsername} style={{margin: 5}}/>
                        <TextField required type="password" value={PW} label="Password" onChange={changePW} style={{margin: 5}}/>
                        <br />
                        <Button onClick={handleAuth} variant="contained" color="primary" disabled={!user||!PW}>Login</Button>
                    </Box>
                </Paper>
            </div>
        </div>
    );
}
export default Login;