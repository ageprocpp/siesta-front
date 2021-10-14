import React, { useEffect, useState } from 'react';
import Header from './Header'
import QrReader from 'react-qr-reader'
import './Scanner.css'
import { Dialog, DialogActions, DialogContent,Button } from '@material-ui/core';
import axios from 'axios';

const API_URL: string|undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

export default function Scanner() {
    const [state, setState] = useState("No result");
    const [isDialogOpen,setIsDialogOpen]=useState<boolean>(false);

    function handleScan(result:string|null) {
        if(isDialogOpen)return;
        if(result){
            setIsDialogOpen(true);
            setState("処理中");
            let data={
                "access_token":localStorage.getItem("access_token"),
                "id": result
            }
            axios.post(API_URL+"/reception",data).then((res)=>{
                interface Data{
                    message: string
                }
                let d:Data=JSON.parse(JSON.stringify(res.data));
                setState(d.message);
            }).catch((err)=>{
                setState("失敗");
                localStorage.removeItem("User");
                localStorage.removeItem("access_token");
            });
        }
    }
    function handleError(err: Error) {
        console.error(err);
    }
    return (
        <div>
            <Header name="Scanner" />
            <QrReader
                onScan={handleScan}
                onError={handleError}
                className="scanner"
            />
            <Dialog open={isDialogOpen} onClose={()=>setIsDialogOpen(false)}>
                <DialogContent>
                    {state}
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setIsDialogOpen(false)}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}