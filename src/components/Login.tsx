import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import Header from './Header'
import '../css/Login.css'
import { isExpired } from 'react-jwt'

import { TextField, Box, Typography, Button, Container } from '@material-ui/core'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}
function Login() {
    const [message, setMessage] = useState<string>('');
    const [user, setUser] = useState<string>('');
    const [PW, setPW] = useState<string>('');

    const token: string | null = localStorage.getItem('access_token');
    const [isLoggedin, setIsLoggedin] = useState<boolean>(token != null && !isExpired(token));

    const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value);
    }
    const changePW = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPW(event.target.value);
    }

    const redirectPath = user === 'admin' ? '/admin' : '/';

    const handleAuth = () => {
        let data = { "deco_id": user, "pw": PW };
        axios.post(API_URL + "/auth/login", JSON.stringify(data)).then(res => {
            let resBody = JSON.parse(JSON.stringify(res.data));
            localStorage.setItem("access_token", resBody.token);
            localStorage.setItem("User", user);
            setIsLoggedin(true);
            console.log(redirectPath);
        }).catch(error => {
            setUser("");
            setPW("");
            setMessage("Authentication failed");
            alert(error);
        })
    }
    return (
        <>
            <Header name="Login" />
            {isLoggedin && <Redirect to={redirectPath} />}
            <Container className="login-paper">
                <Box className="login-box">
                    <Typography component="h1" variant="h5">Login</Typography>
                    <Typography component="h6" style={{ color: 'red' }}>{message}</Typography>
                    <TextField required value={user} label="Username" onChange={changeUsername} style={{ margin: 5 }} />
                    <TextField required type="password" value={PW} label="Password" onChange={changePW} style={{ margin: 5 }} />
                    <br />
                    <Button onClick={handleAuth} variant="contained" color="primary" disabled={!user || !PW}>Login</Button>
                </Box>
            </Container>
        </>
    );
}
export default Login;