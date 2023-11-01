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

const decoList = {
	"admin": "admin",
	"1-AHR": "1年A組",
	"1-BHR": "1年B組",
	"1-CHR": "1年C組",
	"2-AHR": "2年A組",
	"2-BHR": "2年B組",
	"2-CHR": "2年C組",
	"3-AHR": "3年A組",
	"3-BHR": "3年B組",
	"3-CHR": "3年C組",
	"1-1HR": "1年1組",
	"1-2HR": "1年2組",
	"1-3HR": "1年3組",
	"1-4HR": "1年4組",
	"2-1HR": "2年1組",
	"2-2HR": "2年2組",
	"2-3HR": "2年3組",
	"2-4HR": "2年4組",
	"conte": "コント班",
	"stage": "ステージ班",
	"engeki": "演劇班",
	"ennichi": "縁日班",
	"kissa": "喫茶班",
	"shokuhin": "食品班",
	"chuya": "中夜",
	"piano": "ピアノ同好会",
	"music": "音楽部",
	"suken": "数研",
	"oriken": "折り紙研究会",
	"jugglers": "筑駒Jugglers",
	"paken": "パソコン研究部",
	"engeki-club": "演劇部",
	"science": "科学部",
	"biology": "生物部",
	"manken": "漫研",
	"komakin": "駒場棋院",
	"shogi": "将棋部",
	"eizoken": "駒場映像研",
	"nogei": "農芸部",
	"mokko": "木工同好会",
	"cg": "CG同好会",
	"entrance": "入口",
	"exit": "出口",
	"budokan-in": "武道館入口",
	"budokan-out": "武道館出口",
	"tosho-in": "図書スペ入口",
	"tosho-out": "図書スペ出口"
}

const periods = [
	"9:00", "9:10", "9:20", "9:30", "9:40", "9:50",
	"10:00", "10:10", "10:20", "10:30", "10:40", "10:50",
	"11:00", "11:10", "11:20", "11:30", "11:40", "11:50",
	"12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
	"13:00", "13:10", "13:20", "13:30", "13:40", "13:50",
	"14:00", "14:10", "14:20", "14:30", "14:40", "14:50",
	"15:00", "15:10", "15:20", "15:30", "15:40", "15:50",
	"16:00", "16:10", "16:20", "16:30", "16:40", "16:50",
	"17:00", "17:10", "17:20", "17:30", "17:40", "17:50",
	"18:00", "18:10", "18:20", "18:30", "18:40", "18:50",
];

let summaryColumns: GridColDef[] = (() => {
	let res: GridColDef[] = [];
	res.push({ field: "day", headerName: "Day", width: 100, align: "center", headerAlign: "center", sortable: false });
	res.push({ field: "sum", headerName: "合計", width: 100, align: "center", headerAlign: "center", sortable: false });
	for (let period of periods)
		res.push({ field: period, headerName: period, width: 100, align: "center", headerAlign: "center", sortable: false });
	return res;
})();
const allSummaryColumns: GridColDef[] = [
	{ field: "deco_id", headerName: "デコ ID", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "num", headerName: "10 分間の受付人数", flex: 1, align: "center", headerAlign: "center", sortable: false }
];
const decoDetailColumns: GridColDef[] = [
	{ field: "tm", headerName: "時間", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "guest_id", headerName: "来場者 ID", flex: 1, align: "center", headerAlign: "center", sortable: false },
	{ field: "guest_name", headerName: "来場者氏名", flex: 1, align: "center", headerAlign: "center", sortable: false }
];
const decoIdArray = [
	"1-AHR", "1-BHR", "1-CHR", "2-AHR", "2-BHR", "2-CHR", "3-AHR", "3-BHR", "3-CHR", "1-1HR", "1-2HR", "1-3HR", "1-4HR", "2-1HR", "2-2HR", "2-3HR", "2-4HR", "conte", "stage", "engeki", "ennichi", "kissa", "shokuhin", "chuya", "piano", "music", "suken", "oriken", "jugglers", "paken", "engeki-club", "science", "biology", "manken", "komakin", "shogi", "eizoken", "nogei", "mokko", "cg", "entrance", "exit", "budokan-in", "budokan-out", "tosho-in", "tosho-out"
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

	const [summaryRows, setSummaryRows] = useState<Object[]>([]);
	const [summaryDecoId, setSummaryDecoId] = useState('');
	const handleGetDecoSummary = useCallback(() => {
		axios.post(API_URL + '/util/deco/summary', { token: localStorage.getItem("access_token"), deco_id: summaryDecoId })
			.then(res => {
				let resData: Array<Array<Number>> = JSON.parse(JSON.stringify(res.data))['info'];
				let rows: Object[] = [{}, {}, {}];
				resData.forEach((day, dayNumber) => {
					rows[dayNumber]['id'] = dayNumber;
					rows[dayNumber]['day'] = "Day " + (dayNumber + 1)
					rows[dayNumber]['sum'] = day.reduce((sum, amount) => (parseInt(sum.toString()) + parseInt(amount.toString())));
					day.forEach((amount, index) => {
						rows[dayNumber][periods[index]] = amount;
					})
				});
				setSummaryRows(rows);
			})
	}, [summaryDecoId]);
	useEffect(() => handleGetDecoSummary(), [handleGetDecoSummary]);
	const summary = useMemo(() => {
		return (
			<Container className={classes.container} >
				<Typography component="h1" variant="h5" style={{ margin: 20 }}>各デコ受付概況</Typography>
				<Container style={{ padding: 0, margin: 20 }}>
					<FormControl>
						<InputLabel>Deco ID</InputLabel>
						<Select value={summaryDecoId} label="Deco ID" onChange={event => setSummaryDecoId(event.target.value)} style={{ width: 194 }}>
							{
								decoIdArray.map((id) => (
									<MenuItem value={id}>
										<Typography style={{ margin: "auto" }}>{decoList[id]}</Typography>
									</MenuItem>
								))
							}
						</Select>
					</FormControl>
					<Button onClick={handleGetDecoSummary} variant="contained" color="primary" style={{ marginTop: 10, marginLeft: 20 }}>更新</Button>
				</Container>
				<DataGrid rows={summaryRows} columns={summaryColumns} style={{ height: 400, margin: 20 }} disableColumnMenu={true} />
			</Container>
		);
	}, [summaryRows, handleGetDecoSummary, summaryDecoId, classes.container]);


	const [allSummaryRows, setAllSummaryRows] = useState([]);
	const handleSummary = () => {
		axios.post(API_URL + '/admin/deco/recent', { token: localStorage.getItem("access_token") })
			.then(res => {
				let resData: Object[] = JSON.parse(JSON.stringify(res.data));
				resData['info'].forEach((elem: Object, index: Number) => {
					elem['id'] = index;
					elem['deco_id'] = decoList[elem['deco_id']];
				})
				setAllSummaryRows(resData['info']);
			})
	}
	useEffect(() => handleSummary(), []);
	const allSummary = useMemo(() => {
		return (
			<Container className={classes.container} >
				<Typography component="h1" variant="h5" style={{ margin: 20 }}>全デコ直近受付概況</Typography>
				<DataGrid rows={allSummaryRows} columns={allSummaryColumns} style={{ height: 400, margin: 20 }} disableColumnMenu={true} />
			</Container>
		);
	}, [allSummaryRows, classes.container]);

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
										<Typography style={{ margin: "auto" }}>{decoList[id]}</Typography>
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
			{allSummary}
			{decoDetail}
			{guestSearch}
			{guestDetail}
			{downloadDatabase}
		</>
	);
}
export default AdminHome;