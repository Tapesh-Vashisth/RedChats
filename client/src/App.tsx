import React, {useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { fetchCheckUser } from './features/user/userSlice';
import MainUi from './pages/main/MainUi';
import { useAppDispatch, useAppSelector } from './store/hooks'
import { userActions } from './features/user/userSlice';
import ChatList from "./pages/main/ChatList";
import Requests from "./pages/main/Requests";
import AddFriend from "./pages/main/AddFriend";

function App() {
  const [view, setView] = useState<0 | 1 | 2> (0);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const toggleVisibility = (to: 0 | 1 | 2) => {
      setView(to);
  }
  
  useEffect(() => {
    dispatch(fetchCheckUser());
  }, [dispatch]);


  useEffect(() => {
      if (user.method === "check" && user.status === "rejected"){
          navigate("/login");
      }else if(user.method === "check" && user.status === "fulfilled"){
          dispatch(userActions.startConnecting(true));
      }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (user.method === "check" && user.status === "fulfilled"){
      dispatch(userActions.setStatus("idle"));
      dispatch(userActions.setMethod("idle"));
    }else if(user.method === "check" && user.status === "rejected"){
      dispatch(userActions.setStatus("idle"));
      dispatch(userActions.setMethod("idle"));
    }
  }, [user, dispatch]);



  return (
      <Routes>
        <Route path = "/" element = {<MainUi toggleVisibility={toggleVisibility} view = {view} />} >
          <Route index element = {<ChatList toggleVisibility={toggleVisibility} />} />
          <Route path = "chats" element = {<ChatList toggleVisibility={toggleVisibility} />} />
          <Route path = "requests" element = {<Requests />} />
          <Route path = "addFriend" element = {<AddFriend />} />
        </Route>
        <Route path = "/login" element = {<Login />} />
        <Route path = "/signup" element = {<Signup />} />
      </Routes>
  );
}

export default App;
