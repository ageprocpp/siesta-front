import React, { useState, useEffect } from 'react';
import Header from './Header'
import QrReader from 'react-qr-reader'
import '../css/Home.css'
import '../css/Scanner.css'
import { Dialog, DialogTitle, DialogActions, DialogContent, Button } from '@material-ui/core';
import axios from 'axios';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

export default function Scanner() {
    const [state, setState] = useState("No result");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [prevAdmission, setPrevAdmission] = useState<Number>(0);

    function handleScan(result: string | null) {
        if (isDialogOpen) return;
        if (Number(result) === prevAdmission) return;
        if (result) {
            setIsDialogOpen(true);
            setState("処理中");
            axios.post(API_URL + "/util/reception", {
                "token": localStorage.getItem("access_token"),
                "guest_id": Number(result)
            }).then(res => {
                let resBody: Object = JSON.parse(JSON.stringify(res.data));
                setState(resBody['message']);
                setPrevAdmission(Number(result));
            }).catch((err) => {
                console.error(err);
                setState("失敗");
            });
        }
    }
    useEffect(() => {
        if (isDialogOpen) {
            setTimeout(() => setIsDialogOpen(false), 1500);
        }
    }, [isDialogOpen])
    return (
        <>
            <Header name="Scanner" />
            <QrReader
                onScan={handleScan}
                onError={(err: Error) => console.error(err)}
                className="scanner"
            />
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>QR 読み取り</DialogTitle>
                <DialogContent>
                    {state}
                </DialogContent>
            </Dialog>
        </>
    )
}