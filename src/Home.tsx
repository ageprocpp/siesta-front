import React, { useEffect, useState } from 'react';
import { Link, Redirect, BrowserRouter as Router, useHistory } from 'react-router-dom';
import Header from './Header'

import { Button, Paper, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import './Home.css'
import axios from 'axios';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

const useStyles = makeStyles({
    root: {
        marginTop: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '800px',
        width: '100%',
        background: '#e8e8e8',
    },
    table: {
        minWidth: 400,
    },
    cell: {
        "&:nth-child(2n+1)": {
            background: '#ffffff',
        }
    }
});

function two(tim:number){
    if(tim<10){
        return "0"+String(tim);
    }
    return String(tim);
}
function dateToString(tim:number){
    let utc=new Date(tim);
    let res:string=String(utc.getFullYear())+"/"+String(utc.getMonth()+1)+"/"+two(utc.getDate())+" "+two(utc.getHours())+":"+two(utc.getMinutes())+":"+two(utc.getSeconds());
    return res;
}
interface Visitor {
    tim: number,
    guest_id: string
}
function Home() {
    const classes = useStyles();
    const history = useHistory();
    const [visitors, setVisitors] = useState<Array<Visitor>>([]);
    const [visitorTable, setVisitorTable] = useState<Array<JSX.Element>>();

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const startUp = () => {
        setIsDialogOpen(true);
    }
    useEffect(() => {
        axios.post(API_URL + "/list", { "access_token": localStorage.getItem("access_token") })
            .then((res) => {
                let d: Array<Visitor> = JSON.parse(JSON.stringify(res.data)).lis;
                console.log(d);
                setVisitors(d);

                let table: Array<JSX.Element> = d.map((row) => (
                    <TableRow key={row.guest_id} className={classes.cell}>
                        <TableCell component="th" scope="row">{dateToString(row.tim)}</TableCell>
                        <TableCell align="left">{row.guest_id}</TableCell>
                    </TableRow>
                ));
                setVisitorTable(table);
            }).catch((err) => {

            })
    }, [])
    return (
        <div>
            <Header name="Home" />
            <div className="startup">
                <Button variant="contained" onClick={startUp}>起動する</Button>
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogTitle>
                        確認
                    </DialogTitle>
                    <DialogContent>
                        団体 {localStorage.getItem('User')} として起動します。よろしいですか？
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setIsDialogOpen(false) }}>NG</Button>
                        <Button onClick={() => { history.push("/Scanner") }}>OK</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <TableContainer component={Paper} className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>時刻</TableCell>
                                <TableCell align="left">名前</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visitorTable}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
export default Home;