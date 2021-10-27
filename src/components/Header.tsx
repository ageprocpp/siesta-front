import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router';
import { isExpired } from 'react-jwt';
import '../css/Header.css';

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
    "cg": "CG同好会"
}

interface Props {
    name?: string
}
export default function Header(props: Props) {
    const history = useHistory();

    const user: string | null = localStorage.getItem('User');
    const token: string | null = localStorage.getItem('access_token');

    const Logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("User");
        history.push("/login")
    }

    if ((props.name == null || !props.name.match("Login")) && (token == null || isExpired(token))) Logout();

    return (
        <AppBar position="static" className="appbar">
            <Toolbar>
                <Typography variant="h6" component="div">
                    {props.name}
                </Typography>
                {user &&
                    <>
                        <Typography style={{ marginLeft: 'auto', marginRight: 10 }}>{decoList[user]}</Typography>
                        <Button variant="contained" color="secondary" style={{ marginRight: 10 }} onClick={() => history.push("/")}>
                            ホームに戻る
                        </Button>
                        <Button variant="contained" color="secondary" onClick={Logout}>
                            ログアウト
                        </Button>
                    </>
                }
            </Toolbar>
        </AppBar>
    );
}