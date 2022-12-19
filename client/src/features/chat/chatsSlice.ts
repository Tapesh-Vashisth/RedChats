import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseurl from "../../middleware/baseurl";

interface chat{
    chat: {
        chatname: string
        strength: number
        admin: string
        members: {member: {username: string, role: string, active: boolean}} []
        messages: {message: {senderId: string, message: string, date: Date}} []
    },
    active: {username: string, status: boolean} []
}

interface state{
    chats: chat []
    mapping: Map <string, boolean>
    current: number
    loading: boolean
    status: "idle" | "fulfilled" | "rejected"
    method: "idle" | "chatrooms"
    error: any
};

axios.defaults.withCredentials = true;

const initialState: state = {
    chats: [],
    mapping: new Map <string, boolean> (),
    current: 0,
    loading: false,
    status: "idle",
    method: "idle",
    error: ""
};

axios.defaults.withCredentials = true;

const apiChatRooms = baseurl + "chats/getChatlist";
export const fetchChatRooms = createAsyncThunk("fetch/fetchChatRooms", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(apiChatRooms, {withCredentials: true});
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err);
    }
});

const chatSlice = createSlice({
    name: "chats",
    initialState: initialState,
    reducers: {
        reset: () => initialState, 
        setChats: (state, action: PayloadAction <chat []>) => {
            state.chats = action.payload;
        },
        setStatus: (state, action: PayloadAction <"idle" | "fulfilled" | "rejected">) => {
            state.status = action.payload;
        },
        setMethod: (state, action: PayloadAction <"idle" | "chatrooms">) => {
            state.method = action.payload;
        },
        setCurrent: (state, action: PayloadAction <number>) => {
            state.current = action.payload;
        },
        setActive: (state, action: PayloadAction <{username: string, to: boolean}>) => {
            if (state.mapping.has(action.payload.username)){
                state.mapping.set(action.payload.username, action.payload.to);
            }
        },
        addMessage: (state, action: PayloadAction <{message: {senderId: string, message: string, date: Date}, to: string}>) => {
            state.chats.forEach((x, i, arr) => {
                if (x.chat.chatname === action.payload.to){
                    arr[i].chat.messages.push({message: action.payload.message});
                }
            })
        },
        setUpMapping: (state, action: PayloadAction <chat []>) => {
            action.payload.forEach((x) => {
                x.active.forEach((x) => {
                    state.mapping.set(x.username, x.status);
                })
            })
        },
        sendMessage: (state, action: PayloadAction <{senderId: string, to: string, message: string, date: Date}>) => {
            state.chats.forEach((x, i, arr) => {
                if (x.chat.chatname === action.payload.to){
                    arr[i].chat.messages.push({message: {senderId: action.payload.senderId, message: action.payload.message, date: action.payload.date}});
                }
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatRooms.pending, (state, action) => {
                state.loading = true;
                state.error = "";
                state.status = "idle";
                state.method = "chatrooms";
            })
            .addCase(fetchChatRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.chats = action.payload;
            })
            .addCase(fetchChatRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.status = "rejected";
            })
    }
});

export default chatSlice.reducer;
export const chatActions = chatSlice.actions;