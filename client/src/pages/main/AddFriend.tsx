import React, {useState, useEffect} from 'react';
import axios from "axios";
import { Stack } from '@mui/material';
import baseurl from '../../middleware/baseurl';
import { useAppSelector } from '../../store/hooks';

const buttonStyle = {
  borderRadius: "6px",
  width: "40%",
  padding: "4px",
  backgroundColor: "#6d49d1",
  border: "1px solid purple",
  color: "white",
  fontFamily: "Poppins",
  fontWeight: "bold"
}


const AddFriend = () => {
  const [height, setHeight] = useState<number>();
  const user = useAppSelector((state) => state.user);
  const [searched, setSearched] = useState<string>("");
  const [chatid, setChatid] = useState<string>("none");
  const [room, setRoom] = useState<string>("");
  const [strength, setStrength] = useState<number>(2);
  const [adminRooms, setAdminRooms] = useState<string []>([]);
  const [found, setFound] = useState<boolean>(true);
  const [result, setResult] = useState<string []>([]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value);
  }

  const changeIdHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChatid(e.target.value);
  }

  const changeRoomHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  }

  const fetchAdminRooms = async (e: React.FocusEvent<HTMLSelectElement>) => {
    try {
      const response = await axios.post(baseurl + "chats/findAdminRooms", {username: user.username}, {withCredentials: true});
      const data = await response.data;
      setAdminRooms(data.adminRooms);
    } catch (err: any) {
      e.target.blur();
      alert("something went wrong gotcha");
    }
  }

  const changeStrengthHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrength(Number(e.target.value));
  }

  const submitRoomHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await axios.post(baseurl + "chats/createRoom", {username: user.username, chatroom: room, strength: strength}, {withCredentials: true});
      await response.data;
      alert("let's see");
    } catch (err: any) {
      alert("something went wrong");
    }
  }

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (chatid !== "none"){
      try {
        if (user.username !== searched){
          const response = await axios.post(baseurl + "auth/user/findUser", {username: searched}, {withCredentials: true});
          const users = response.data;
          setFound(true);
          setResult(users.search); 
        }else{
          alert("can't send request to yourself");
        }
      } catch (err: any) {
        alert("something went wrong");
        setFound(false);
        setResult([]);
      }
    }else{
      alert("please select a chat room");
    }
  }

  const addHandler = async (e: React.MouseEvent<HTMLButtonElement>, username: string) => {
    try {
      await axios.post(baseurl + "auth/user/addFriend", {chatid, to: username, from: user.username}, {withCredentials: true});
      alert("successfully sent request");
    } catch (err: any) {
      alert("something went wrong");
    }
  }

  useEffect(() => {
    setHeight(document.getElementsByClassName("height")[0].clientHeight);
  }, []);



  return (
    <Stack direction = "column" spacing={4} padding = {2} style = {{height: height, backgroundColor: "#1e1a29", color: "#7f8054", overflowY: "scroll"}}>
      <Stack direction="column" justifyContent="center"textAlign="center" spacing={1} >
        <h3 style = {{color: "#a18d37"}}>Create new chatroom</h3>
        <Stack direction="column" textAlign="center" spacing = {2} alignItems = "center">
          <p>enter the room name: </p>
          <input type = "text" onChange={changeRoomHandler} placeholder='chatroom' style = {{width : "80%", backgroundColor: "#514663", padding: "4px"}}></input>
          <p>Max Strength: </p>
          <Stack direction = "row" spacing={1}>
            <input type = "range" value = {strength} onChange={changeStrengthHandler} min = "2" max = "8"></input>
            <p>{strength}</p>
          </Stack>
          <button style = {buttonStyle} onClick = {submitRoomHandler} >Create</button>
        </Stack>
      </Stack>
      <Stack direction="column" spacing={1} justifyContent="center" textAlign="center">
        <h3 style = {{color: "#a18d37"}}>Add members to chatroom</h3>
        <Stack direction = "column" spacing={2} justifyContent="center" alignItems = "center" style = {{textAlign: "center"}}>
          <p>Enter the username</p>
          <input type="text" placeholder='username' style={{width: "80%", backgroundColor: "#514663", padding: "4px"}} onChange = {changeHandler}></input>
          <p>Chat Room: </p>
          <select name = "room" value={chatid} style = {{padding: "4px", color: "#7f8054", backgroundColor: "#514663", opacity: 1}} onChange={changeIdHandler} onFocus = {fetchAdminRooms}>
            <option value = "none" disabled>select an option</option>
            {adminRooms.map((x, i) => {
              return (
                <option key = {i} value = {x}>{x}</option>
              )
            })}
          </select>
          <button onClick = {submitHandler} style = {buttonStyle}>Search</button>
          {
            found && result.length === 0 ? null
            :
            found && result.length > 0 ? 
            <Stack direction="column" spacing = {1}>
              <p>Found</p>
              {result.map((x, i) => {
                return (
                  <Stack key = {i} direction = "row" spacing={2}>
                    <p>{x}</p>
                    <button onClick={(e) => {addHandler(e, x)}} style = {{borderRadius: "6px", padding: "2px 4px", backgroundColor: "#6d49d1", border: "1px solid purple", color: "white", fontFamily: "Poppins"}}>Add Friend</button>
                  </Stack>
                )
              })}
            </Stack>
            : <p>Not found</p>
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

export default AddFriend;