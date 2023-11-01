import React, { useState } from 'react';
import Header from './Header'
import QrReader from 'react-qr-reader'
import '../css/Home.css'
import '../css/Scanner.css'
import { Dialog, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import axios from 'axios';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}


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

export default function Scanner() {
    const [state, setState] = useState("No result");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [prevAdmission, setPrevAdmission] = useState<Number>(0);

    const user = localStorage.getItem('User');

    function handleScan(result: string | null) {
        if (isDialogOpen) return;
        if (Number(result) === prevAdmission) return;
        if (result) {
            setIsDialogOpen(true);
            setState("処理中");
            let dataString = localStorage.getItem("data");
            let data: Object[] = [];
            if (dataString) data = JSON.parse(dataString);
            var time = new Date();
            data.push({ "time": time.getTime(), "deco": user, "guest_id": Number(result) });
            localStorage.setItem("data", JSON.stringify(data));
            axios.post(API_URL + "/util/reception", {
                "token": localStorage.getItem("access_token"),
                "guest_id": Number(result)
            }).then(res => {
                setState("成功");
                setPrevAdmission(Number(result));
                setTimeout(() => setIsDialogOpen(false), 1500);
            }).catch((err) => {
                console.error(err);
                setState("失敗");
            });
        }
    }
    return (
        <>
            <Header name="Scanner" />
            <Typography variant="h2" className="DecoDisplay">団体:{user && decoList[user]}</Typography>
            <QrReader
                onScan={handleScan}
                onError={(err: Error) => console.error(err)}
                className="scanner"
                style={{ maxWidth: "calc(min(100vh, 100vw) - 64px)" }}
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