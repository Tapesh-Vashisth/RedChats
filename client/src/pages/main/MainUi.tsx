import {useEffect} from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Navbar from "../../components/reusableComponents/Navbar";
import {Stack} from "@mui/material";
import { Outlet } from "react-router-dom";
import Chat from "./Chat";
import {Grid} from "@mui/material";
import Members from "./Members";
import { fetchChatRooms, chatActions } from "../../features/chat/chatsSlice";

interface props{
    view: 0 | 1 | 2
    toggleVisibility: (to: 0 | 1 | 2) => void
}

const MainUi = (props: props) => {
    const dispatch = useAppDispatch();
    const chats = useAppSelector((state) => (state.chats));
    
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
            <Navbar toggleVisibility = {props.toggleVisibility} />
            <Grid className = "height" container style = {{flexGrow: 1}} columns = {16} >
                <Grid item xs = {16} sm = {4} sx = {{display: {xs: props.view === 0 ? "block" : "none", sm: "block"}}}>
                    <Outlet />
                </Grid>
                <Grid item sx = {{display: {xs: props.view === 1 ? "block" : "none", sm: "block"}}} xs = {16} sm = {8}>
                    <Chat toggleVisibility={props.toggleVisibility}/>
                </Grid>
                <Grid item sx = {{display: {xs: props.view === 2 ? "block" : "none", sm: "block"}}} xs = {16} sm = {4}>
                    <Members />
                </Grid>
            </Grid>
        </Stack>
    );
}

export default MainUi;