import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASEURL from "../../middleware/baseurl";

interface state{
    email: string
    username: string
    connecting: boolean
    connected: boolean
    active: boolean
    login: boolean
    loading: boolean
    status: "idle" | "fulfilled" | "rejected"
    method: "idle" | "login" | "logout" | "signup" | "check"
    error: any
}

const initialState: state = {
    email: "",
    username: "",
    active: false,
    login: false,
    connecting: false,
    connected: false,
    loading: false,
    status: "idle",
    method: "idle",
    error: ""
}

interface credentialsIn{
    email: string
    password: string
}

axios.defaults.withCredentials = true;

const apiIn = BASEURL + "auth/user/login";
export const fetchInUser = createAsyncThunk("fetch/fetchInUser", async (credentials: credentialsIn, {rejectWithValue}) => {
    try {
        const response = await axios.post(apiIn, credentials);
        console.log(response.data);
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err);
    }
})


interface credentialsUp{
    email: string
    username: string
    password: string
}

const apiUp = BASEURL + "auth/user/signup";
export const fetchUpUser = createAsyncThunk("fetch/fetchUpUser", async (credentials: credentialsUp, {rejectWithValue}) => {
    try {
        const response = await axios.post(apiUp, credentials);
        console.log(response.data);
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err);
    }
})

const apiOut = BASEURL + "auth/user/logout";
export const fetchOutUser = createAsyncThunk("fetch/fetchOutUser", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(apiOut);
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err);
    }
})

const apiCheck = BASEURL + "auth/user/check";
export const fetchCheckUser = createAsyncThunk("fetch/fetchCheckUser", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(apiCheck);
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err);
    }
})


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: () => initialState, 
        setEmail: (state, action: PayloadAction <string>) => {
            state.email = action.payload;
        },
        setUsername: (state, action: PayloadAction <string>) => {
            state.username = action.payload;
        },
        setLogin: (state, action: PayloadAction <boolean>) => {
            state.login = action.payload
        },
        setStatus: (state, action: PayloadAction <"idle" | "fulfilled" | "rejected">) => {
            state.status = action.payload
        },
        setMethod: (state, action: PayloadAction <"idle" | "logout" | "signup" | "login" | "check">) => {
            state.method = action.payload
        },
        setActive: (state, action: PayloadAction <boolean>) => {
            state.active = action.payload
        },
        startConnecting: (state, action: PayloadAction <boolean>) => {
            state.connecting = action.payload
        },
        connectionEstablished: (state, action: PayloadAction <boolean>) => {
            state.connected = action.payload
        },
        toggleActive: (state) => {
            ;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInUser.pending, (state, action) => {
                state.loading = true;
                state.method = "login";
                state.status = "idle";
            })
            .addCase(fetchInUser.rejected, (state, action) => {
                state.loading = false;
                state.method = "login";
                state.login = false;
                state.active = false;
                state.status = "rejected";
                state.email = "";
                state.username = "";
                state.error = action.error.message;
            })
            .addCase(fetchInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.method = "login";
                state.status = "fulfilled";
                state.username = action.payload.username;
                state.active = action.payload.active;
                state.email = action.payload.email;
                state.error = "";           
            })
            .addCase(fetchUpUser.pending, (state, action) => {
                state.loading = true;
                state.method = "signup";
                state.status = "idle";
            })
            .addCase(fetchUpUser.rejected, (state, action) => {
                state.loading = false;
                state.method = "signup";
                state.login = false;
                state.status = "rejected";
                state.active = false;
                state.error = action.error.message;
                state.email = "";
                state.username = "";
            })
            .addCase(fetchUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.method = "signup";
                state.login = true;
                state.status = "fulfilled";
                state.email = action.payload.email;
                state.username = action.payload.username;
                state.active = action.payload.active;
                state.error = "";
            })
            .addCase(fetchOutUser.pending, (state, action) => {
                state.loading = true;
                state.method = "logout";
                state.status = "idle";
                
            })
            .addCase(fetchOutUser.rejected, (state, action) => {
                state.loading = false;
                state.method = "logout";
                state.login = true;
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(fetchOutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.method = "logout";
                state.login = false;
                state.status = "fulfilled";
                state.username = "";
                state.active = false;
                state.email = "";
                state.error = "";
            })
            .addCase(fetchCheckUser.pending, (state, action) => {
                state.loading = true;
                state.method = "check";
                state.status = "idle";
            })
            .addCase(fetchCheckUser.rejected, (state, action) => {
                state.loading = false;
                state.method = "check";
                state.login = false;
                state.status = "rejected";
                state.email = "";
                state.username = "";
                state.active = false;
                state.error = action.error.message;
            })
            .addCase(fetchCheckUser.fulfilled, (state, action) => {
                state.loading = false;
                state.method = "check";
                state.status = "fulfilled";
                state.login = true;
                state.username = action.payload.username;
                state.active = action.payload.active;
                state.email = action.payload.email;
                state.error = "";
            })
        }
    })
    
    
    
    export default userSlice.reducer;
    export const userActions = userSlice.actions;