import React from 'react'
import {Stack} from "@mui/material";
import { useAppSelector } from '../store/hooks';
import ListIcon from '@mui/icons-material/List';




interface props{
  height: number
  toggleVisibility: (to : 0 | 1 | 2) => void
}

const ChatHeader = (props: props) => {
  const chat = useAppSelector((state) => state.chats);

  return (
    <Stack direction = "row" alignItems="center" justifyContent="space-between" style = {{height: props.height, color: "white", borderBottom: "2px solid #373240"}} padding = {2}>
        <h2>{chat.chats[chat.current].chat.chatname}</h2>
        <Stack direction = "row" alignItems="center">
          <ListIcon sx = {{display: {xs: "block", sm: "none"}}} onClick = {() => {props.toggleVisibility(2)}} />
        </Stack>
    </Stack>
  );
}

export default ChatHeader;