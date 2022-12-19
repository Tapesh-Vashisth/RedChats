import React, {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Navbar from "../../components/reusableComponents/Navbar";
import {Stack} from "@mui/material";
import { Outlet } from "react-router-dom";
import Chat from "./Chat";
import {Grid} from "@mui/material";
import Members from "./Members";
import { fetchChatRooms, chatActions } from "../../features/chat/chatsSlice";

const MainUi = (props: any) => {
    const dispatch = useAppDispatch();
    const chats = useAppSelector((state) => (state.chats));
    const [view, setView] = useState<0 | 1 | 2> (0);
    
    const toggleVisibility = (to: 0 | 1 | 2) => {
        setView(to);
    }
    
    useEffect(() => {
        dispatch(fetchChatRooms());
    }, [dispatch])

    useEffect(() => {
        if (chats.method === "chatrooms"){
            if (chats.status === "fulfilled"){
                dispatch(chatActions.setUpMapping(chats.chats));
                dispatch(chatActions.setStatus("idle"));
                dispatch(chatActions.setMethod("idle"));
            }else if (chats.status === "rejected"){
                dispatch(chatActions.setStatus("idle"));
                dispatch(chatActions.setMethod("idle"));
            }
        }
    }, [chats, dispatch])    

    return (
        <Stack direction = "column" style = {{minHeight: "100vh", backgroundColor: "#1e1a29"}}>
            <Navbar toggleVisibility = {toggleVisibility} />
            <Grid className = "height" container style = {{flexGrow: 1}} columns = {16} >
                <Grid item xs = {16} sm = {4} sx = {{display: {xs: view === 0 ? "block" : "none", sm: "block"}}}>
                    <Outlet />
                </Grid>
                <Grid item sx = {{display: {xs: view === 1 ? "block" : "none", sm: "block"}}} xs = {16} sm = {8}>
                    <Chat toggleVisibility={toggleVisibility}/>
                </Grid>
                <Grid item sx = {{display: {xs: view === 2 ? "block" : "none", sm: "block"}}} xs = {16} sm = {4}>
                    <Members />
                </Grid>
            </Grid>
        </Stack>
    );
}

export default MainUi;