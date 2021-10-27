import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles'
import Header from './Header';

import { Button, Container, Typography, TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { isExpired } from 'react-jwt'

import '../css/Home.css';
import axios from 'axios';
import { saveAs } from 'file-saver'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
	axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

const useStyles = makeStyles({
	container: {
		margin: "40px",
		backgroundColor: "white",
		borderRadius: 10,
		textAlign: "left",
		width: "100%",
		padding: 20
	}
});

const summaryColumns: GridColDef[] = [
	{ field: "deco_id", headerName: "デコ ID", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "num", headerName: "30 分間の受付人数", flex: 1, align: "center", headerAlign: "center", sortable: false }
];
const decoDetailColumns: GridColDef[] = [
	{ field: "tm", headerName: "時間", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "guest_id", headerName: "来場者 ID", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "guest_name", headerName: "来場者氏名", flex: 1, align: "center", headerAlign: "center", sortable: false }
];
const decoIdArray = [
	"1-AHR", "1-BHR", "1-CHR", "2-AHR", "2-BHR", "2-CHR", "3-AHR", "3-BHR", "3-CHR", "1-1HR", "1-2HR", "1-3HR", "1-4HR", "2-1HR", "2-2HR", "2-3HR", "2-4HR", "conte", "stage", "engeki", "ennichi", "kissa", "shokuhin", "chuya", "jichikai", "piano", "music", "suken", "oriken", "jugglers", "paken", "puzzle", "engeki-club", "science", "biology", "tekken", "manken", "komakin", "shogi", "eizoken", "nogei", "mokko", "cg", "ensemble", "bungei"
];
const guestSearchColumns: GridColDef[] = [
	{ field: "guest_id", headerName: "来場者 ID", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "guest_name", headerName: "来場者氏名", flex: 1, align: "center", headerAlign: "center", sortable: false }
];
const guestDetailColumns: GridColDef[] = [
	{ field: "tm", headerName: "時間", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "deco_id", headerName: "デコ ID", flex: 1, align: "center", headerAlign: "center", sortable: false },
]
const downloadModeArray = ["decos", "guests", "enterlog", "requestlog"];

function AdminHome() {
	const classes = useStyles();
	const history = useHistory();
	const token: string | null = localStorage.getItem('access_token')
	if (token == null || isExpired(token)) {
		localStorage.removeItem("access_token");
		localStorage.removeItem("User");
		history.push("/admin/login");
	}

	const [summaryRows, setSummaryRows] = useState([]);
	const handleSummary = () => {
		axios.post(API_URL + '/admin/deco/recent', { token: localStorage.getItem("access_token") })
			.then(res => {
				let resData: Object[] = JSON.parse(JSON.stringify(res.data));
				resData['info'].forEach((elem: Object, index: Number) => elem['id'] = index)
				setSummaryRows(resData['info'])
			})
	}
	useEffect(() => handleSummary(), []);
	const summary = useMemo(() => {
		return (
			<Container className={classes.container} >
				<Typography component="h1" variant="h5" style={{ margin: 20 }}>全デコ直近受付概況</Typography>
				<DataGrid rows={summaryRows} columns={summaryColumns} style={{ height: 400, margin: 20 }} disableColumnMenu={true} />
			</Container>
		);
	}, [summaryRows, classes.container]);

	const [decoId, setDecoId] = useState('');
	const [decoDetailRows, setDecoDetailRows] = useState([]);
	useEffect(() => {
		axios.post(API_URL + '/admin/deco/detail', { "token": localStorage.getItem("access_token"), "deco_id": decoId })
			.then(res => {
				let resData = JSON.parse(JSON.stringify(res.data));
				resData['log'].forEach((elem: Object, index: Number) => { elem['id'] = index; });
				setDecoDetailRows(resData['log']);
			})
	}, [decoId]);
	const decoDetail = useMemo(() => {
		return (
			<Container className={classes.container} >
				<Typography component="h1" variant="h5" style={{ padding: 20 }}>デコ詳細情報</Typography>
				<Container style={{ padding: 0, margin: 20 }}>
					<FormControl>
						<InputLabel>Deco ID</InputLabel>
						<Select value={decoId} label="Deco ID" onChange={event => setDecoId(event.target.value)} style={{ width: 194 }}>
							{
								decoIdArray.map((id) => (
									<MenuItem value={id}>
										<Typography style={{ margin: "auto" }}>{id}</Typography>
									</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</Container>
				<DataGrid rows={decoDetailRows} columns={decoDetailColumns} style={{ height: 400, margin: 20 }} disableColumnMenu={true} />
			</Container >
		);
	}, [decoId, decoDetailRows, classes.container]);

	const [guestSearchKeyword, setGuestSearchKeyword] = useState('');
	const [guestSearchRows, setGuestSearchRows] = useState([]);
	const handleGuestSearch = useCallback(() => {
		axios.post(API_URL + '/admin/guest/search', { "token": localStorage.getItem("access_token"), "keyword": guestSearchKeyword })
			.then(res => {
				let resData: Object[] = JSON.parse(JSON.stringify(res.data))
				resData['result'].forEach((elem: Object, index: Number) => elem['id'] = index)
				setGuestSearchRows(resData['result'])
			});
	}, [guestSearchKeyword]);
	const guestSearch = useMemo(() => {
		return (
			<Container className={classes.container}>
				<Typography component="h1" variant="h5" style={{ padding: 20 }}>来場者検索</Typography>
				<Container style={{ padding: 0, margin: 20 }}>
					<TextField
						value={guestSearchKeyword}
						label="Guest Keyword"
						onChange={event => { setGuestSearchKeyword(event.target.value) }}
						onKeyDown={event => {
							if (event.keyCode === 13) handleGuestSearch();
						}}
					/>
					<Button onClick={handleGuestSearch} variant="contained" color="primary" style={{ marginTop: 10, marginLeft: 20 }}>表示</Button>
				</Container>
				<DataGrid rows={guestSearchRows} columns={guestSearchColumns} style={{ height: 400, margin: 20 }} disableColumnMenu={true} />
			</Container>
		);
	}, [guestSearchKeyword, guestSearchRows, classes.container, handleGuestSearch]);

	const [guestId, setGuestId] = useState('');
	const [guestDetailRows, setGuestDetailRows] = useState([])
	const handleGetGuestDetail = useCallback(() => {
		axios.post(API_URL + '/admin/guest/detail', { "token": localStorage.getItem("access_token"), "guest_id": Number(guestId) })
			.then(res => {
				let resData: Object[] = JSON.parse(JSON.stringify(res.data))
				resData['log'].forEach((elem: Object, index: Number) => elem['id'] = index)
				setGuestDetailRows(resData['log'])
			});
	}, [guestId]);
	const guestDetail = useMemo(() => {
		return (
			<Container className={classes.container}>
				<Typography component="h1" variant="h5" style={{ padding: 20 }}>来場者情報</Typography>
				<Container style={{ padding: 0, margin: 20 }}>
					<TextField value={guestId} label="Guest ID" onChange={event => { setGuestId(event.target.value) }} />
					<Button onClick={handleGetGuestDetail} variant="contained" color="primary" disabled={!guestId} style={{ marginTop: 10, marginLeft: 20 }}>表示</Button>
				</Container>
				<DataGrid rows={guestDetailRows} columns={guestDetailColumns} style={{ height: 400, margin: 20 }} disableColumnMenu={true} />
			</Container>
		)
	}, [guestId, guestDetailRows, classes.container, handleGetGuestDetail])

	const [downloadMode, setDownloadMode] = useState('')
	const handleDownloadDatabase = useCallback(() => {
		axios.post(API_URL + '/admin/database', { "token": localStorage.getItem("access_token"), "table": downloadMode })
			.then((res: any) => {
				const blob = new Blob([res.data], { type: "csv" });
				saveAs(blob, downloadMode + ".csv");
			});
	}, [downloadMode]);
	const downloadDatabase = useMemo(() => {
		return (
			<Container className={classes.container}>
				<Typography component="h1" variant="h5" style={{ padding: 20 }}>データベースのエクスポート</Typography>
				<Container style={{ padding: 0, margin: 20 }}>
					<FormControl>
						<InputLabel>Data Table</InputLabel>
						<Select value={downloadMode} label="Data Table" onChange={event => { setDownloadMode(event.target.value) }} style={{ width: 194 }}>
							{
								downloadModeArray.map((mode) => (
									<MenuItem value={mode}>
										<Typography style={{ margin: "auto" }}>{mode}</Typography>
									</MenuItem>
								))
							}
						</Select>
					</FormControl>
					<Button onClick={handleDownloadDatabase} variant="contained" color="primary" style={{ marginTop: 10, marginLeft: 20 }}>エクスポート</Button>
				</Container>
			</Container>
		);
	}, [downloadMode, classes.container, handleDownloadDatabase]);

	return (
		<>
			<Header name="Admin Home" />
			{summary}
			{decoDetail}
			{guestSearch}
			{guestDetail}
			{downloadDatabase}
		</>
	);
}
export default AdminHome;