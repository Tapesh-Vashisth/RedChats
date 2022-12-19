import React, {useEffect, useState} from 'react'
import { Stack } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { chatActions } from '../../features/chat/chatsSlice';

const ChatList = () => {
  const [height, setHeight] = useState<number>();
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chats);

  useEffect(() => {
    setHeight(document.getElementsByClassName("height")[0].clientHeight);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>, clicked: number) => {
    dispatch(chatActions.setCurrent(clicked));
  }

  return (
    <Stack direction = "column" padding = "0px 10px" style = {{height: height, overflowY: "scroll", overflowX: "hidden", backgroundColor: "#1e1a29", color: "#7f8054"}}>
      {chats.chats.map((x, i) => {
        return (
          <Stack key = {i} onClick = {(e) => {handleClick(e, i)}} direction = "column" padding = {1} justifyContent = "left" style = {{borderBottom: "1px solid black", cursor: "pointer"}}>
            <h5>{x.chat.chatname}</h5>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default ChatList;