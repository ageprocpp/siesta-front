import axios from 'axios';
import React, { useState } from 'react';
import Header from './Header'
import '../css/Login.css'

import { TextField, Box, Typography, Button, Container } from '@material-ui/core'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
	axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}
interface Props {
	adminMode: boolean
}
function ChangePassword(props: Props) {
	const [message, setMessage] = useState<string>('');
	const [oldPW, setOldPW] = useState<string>('');
	const [newPW, setNewPW] = useState<string>('');
	const [newPWConfirm, setNewPWConfirm] = useState<string>('');

	const handleAuth = () => {
		axios.post(API_URL + "/auth/changepw", { "token": localStorage.getItem("access_token"), "old_pw": oldPW, "new_pw": newPW }).then(res => {
			setMessage("Password is changed")
		}).catch(err => {
			setOldPW(''); setNewPW(''); setNewPWConfirm('');
			setMessage("Authentication failed");
			console.error(err);
		})
	}
	return (
		<>
			<Header name="Change Password" />
			<Container className="login-paper">
				<Box className="login-box">
					<Typography component="h1" variant="h5">Change Password</Typography>
					<Typography component="h6" style={{ color: 'red' }}>{message}</Typography>
					<TextField required type="password" value={oldPW} label="Old Password" onChange={e => setOldPW(e.target.value)} style={{ margin: 5 }} />
					<TextField required type="password" value={newPW} label="New Password" onChange={e => setNewPW(e.target.value)} style={{ margin: 5 }} />
					<TextField required type="password" value={newPWConfirm} label="New Password Again" onChange={e => setNewPWConfirm(e.target.value)} style={{ margin: 5 }} />
					<br />
					<Button onClick={handleAuth} variant="contained" color="primary" disabled={!oldPW || !newPW || newPW !== newPWConfirm}>Change Password</Button>
				</Box>
			</Container>
		</>
	);
}
export default ChangePassword