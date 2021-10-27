import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { makeStyles } from '@mui/styles'
import Header from './Header';

import { Button, Dialog, DialogContent, DialogTitle, DialogActions, Container, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import axios from 'axios';

import '../css/Home.css';

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
    "cg": "CG同好会"
}

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

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

function Home() {
    const history = useHistory();
    const classes = useStyles();

    const user = localStorage.getItem('User') || 'null'

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const [summaryRows, setSummaryRows] = useState<Object[]>([]);

    let summaryColumns: GridColDef[] = useMemo(() => {
        let res: GridColDef[] = [];
        res.push({ field: "day", headerName: "Day", width: 100, align: "center", headerAlign: "center", sortable: false });
        res.push({ field: "sum", headerName: "合計", width: 100, align: "center", headerAlign: "center", sortable: false });
        for (let period of periods)
            res.push({ field: period, headerName: period, width: 100, align: "center", headerAlign: "center", sortable: false });
        return res;
    }, []);

    const handleGetDecoSummary = () => {
        axios.post(API_URL + '/util/deco/summary', { token: localStorage.getItem("access_token") })
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
    }
    useEffect(() => handleGetDecoSummary(), []);
    const summary = useMemo(() => {
        return (
            <Container className={classes.container} >
                <Typography component="h1" variant="h5" style={{ margin: 20 }}>デコ受付概況</Typography>
                <Button onClick={handleGetDecoSummary} variant="contained" color="primary" style={{ marginTop: 10, marginLeft: 20 }}>表示</Button>
                <DataGrid rows={summaryRows} columns={summaryColumns} style={{ height: 400, margin: 20 }} disableColumnMenu={true} />
            </Container>
        );
    }, [summaryRows, summaryColumns, classes.container]);

    return (
        <>
            <Header name="Home" />
            {user === 'admin' && <Redirect to='/admin' />}
            <div className="startup">
                <Button variant="contained" onClick={() => setIsDialogOpen(true)}>起動する</Button>
                {summary}
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogTitle>
                        確認
                    </DialogTitle>
                    <DialogContent>
                        団体 {decoList[user]} として起動します。よろしいですか？
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setIsDialogOpen(false) }}>NG</Button>
                        <Button onClick={() => { history.push("/Scanner") }}>OK</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
export default Home;