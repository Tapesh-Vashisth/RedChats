import { configureStore } from "@reduxjs/toolkit";
import user from "../features/user/userSlice";
import userDetail from "../features/user/userDetailsSlice";
import chats from "../features/chat/chatsSlice";
import logger from "redux-logger";
import {enableMapSet} from "immer";
import connectionMiddleware from "./middlewares/connectionMiddleware";

enableMapSet();

const store = configureStore({
    reducer: {
        user,
        userDetail,
        chats
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat([logger, connectionMiddleware])
})


export default store;
export type RootState = ReturnType <typeof store.getState>
export type AppDispatch = typeof store.dispatch


