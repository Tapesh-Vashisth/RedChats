import React, {useEffect, useRef, useState} from 'react'
import ChatHeader from '../../components/ChatHeader';
import { Stack } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import MessageControl from '../../components/MessageControl';
import Message from '../../components/Message';

let senderHeight: number;
let headerHeight: number;

interface props {
  toggleVisibility: (to: 0 | 1 | 2) => void
}

const Chat = (props: props) => {
  const [height, setHeight] = useState<number>();
  const [chatHeight, setChatHeight] = useState<number>();
  const chat = useAppSelector((state) => state.chats);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current){
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  useEffect(() => {
    setHeight(document.getElementsByClassName("height")[0].clientHeight);
    headerHeight = 40;
    senderHeight = 40;
  }, []);
  
  useEffect(() => {
    setChatHeight(height! - (headerHeight + senderHeight));
  }, [height]);

  return (
    <>
      {chat.chats.length > 0 ? 
        <Stack direction = "column" style = {{height: height, position: "relative"}}>
            <ChatHeader height = {headerHeight} toggleVisibility = {props.toggleVisibility} />
            <Stack className = "chatground" direction = "column" spacing = {1} paddingLeft = {2} paddingRight = {2} style = {{height: chatHeight, fontSize: "16px", overflow: "scroll", overflowX: "hidden", backgroundColor: "#18151c"}}>
              {
                chat.chats[chat.current].chat.messages.map((x, i) => {
                  return (
                    <Message key = {i} message={x.message.message} sender = {x.message.senderId} date = {x.message.date} />
                  )
                })
              }
              <div ref = {divRef}></div>
            </Stack>
            <MessageControl height = {senderHeight} />
        </Stack> : null 
      }
    </>
  )
}

export default Chat