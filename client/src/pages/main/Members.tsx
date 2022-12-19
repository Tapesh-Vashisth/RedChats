import React, {useEffect, useState} from 'react';
import {Stack} from "@mui/material";
import { useAppSelector } from '../../store/hooks';
import CircleIcon from '@mui/icons-material/Circle';

const Members = () => {
    const [height, setHeight] = useState<number>();

    useEffect(() => {
        setHeight(document.getElementsByClassName("height")[0].clientHeight);
    }, []);

    const chat = useAppSelector((state) => state.chats);
    return (
        <>
            {chat.chats.length > 0 ? 
            <Stack direction = "column" style={{height: height, border: "1px solid black", overflowY: "scroll"}}>
                {chat.chats[chat.current].chat.members.map((x, i) => {
                    return (
                        <Stack key = {i} direction = "row" padding={2} justifyContent="space-between" style = {{cursor: "pointer"}}>
                            <p style = {{color: "#2642a6"}}>{x.member.username}</p>
                            <CircleIcon style = {{color: chat.mapping.get(x.member.username) ? "green": "red"}} />
                        </Stack>
                    )
                })}
            </Stack>: null}
        </>
    )
}

export default Members