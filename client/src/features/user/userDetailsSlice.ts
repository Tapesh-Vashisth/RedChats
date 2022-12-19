import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseurl from "../../middleware/baseurl";

interface state{
    chatRooms: {chatroom: string} []
    Requests: {username: String, chatroom: String, flow: Boolean} []
    loading: boolean
    status: "idle" | "fulfilled" | "rejected"
    method: "idle" | "requests"
    error: any
}

const initialState: state = {
    chatRooms: [],
    Requests: [],
    loading: false,
    status: "idle",
    method: "idle",
    error: ""
}

axios.defaults.withCredentials = true;

const apiReq = baseurl + "auth/user/getRequests";
export const fetchRequests = createAsyncThunk("fetch/fetchRequests", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(apiReq, {withCredentials: true});
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err);
    }
});


const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState,
    reducers: {
        reset: () => initialState, 
        setChatRooms: (state, action: PayloadAction <{chatroom: string} []>) => {
            state.chatRooms = action.payload;
        },
        setRequests: (state, action: PayloadAction <{username: String, chatroom: String, flow: Boolean} []>) => {
            state.Requests = action.payload;
        },
        setStatus: (state, action: PayloadAction <"idle" | "fulfilled" | "rejected">) => {
            state.status = action.payload;
        },
        setMethod: (state, action: PayloadAction <"idle" | "requests">) => {
            state.method = action.payload;
        },
        acceptRequest: (state, action: PayloadAction <{username: String, chatroom: String}>) => {
            ;
        },
        rejectIncomingRequest: (state, action: PayloadAction <{username: String, chatroom: String}>) => {
            ;
        },
        rejectOutgoingRequest: (state, action: PayloadAction <{username: String, chatroom: String}>) => {
            ;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.pending, (state, action) => {
                state.loading = true;
                state.error = "";
                state.status = "idle";
                state.method = "requests";
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.Requests = action.payload.Requests;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.status = "rejected";
            })
    }
})

export default userDetailsSlice.reducer;
export const userDetailActions = userDetailsSlice.actions;
