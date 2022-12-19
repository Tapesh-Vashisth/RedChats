import React, {useState, useRef} from 'react'
import {Stack} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { chatActions } from '../features/chat/chatsSlice';

interface props {
    height: number
}

const MessageControl = (props: props) => {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const chat = useAppSelector((state) => state.chats);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }

  const sendHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    dispatch(chatActions.sendMessage({senderId: user.username, to: chat.chats[chat.current].chat.chatname, message: message, date: new Date()}));
    setMessage("");
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2} style = {{height: props.height, width: "100%", paddingRight: "9px", position: "absolute", bottom: "0px"}}>
      <input ref = {inputRef} placeholder='type to message' onChange = {handleChange} value = {message} style = {{height: props.height, color: "#aaa8b5", backgroundColor: "#262629", borderRadius: "0px", fontSize: "16px", border: "none", padding: "4px"}}></input>
      <SendIcon onClick = {sendHandler} style = {{cursor: "pointer"}} />
    </Stack>
  )
}

export default MessageControl;