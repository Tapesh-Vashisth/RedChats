import React from 'react'
import { Stack } from '@mui/material'
import { useAppSelector } from '../store/hooks'

interface props{
    message: string
    sender: string
    date: Date
}

const Message = (props: props) => {
    const user = useAppSelector((state) => state.user);

    return (
        <Stack direction = "column">
            <Stack style = {{color: "#766299", alignSelf: props.sender === user.username ? "flex-end": "flex-start", backgroundColor: "#0c0912", fontSize: "16px", padding: "3px", borderRadius: "7px", textAlign: props.sender === user.username ? "right": "left"}}>
                {props.sender !== user.username ? <p style={{color: "#2642a6", fontSize: "13px"}}>{props.sender}</p>: null}   
                {props.message}
            </Stack>
        </Stack>
    )
}

export default Message