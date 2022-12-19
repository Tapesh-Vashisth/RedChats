import React, { useEffect } from 'react'
import { Stack } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchRequests } from '../../features/user/userDetailsSlice';
import { userDetailActions } from '../../features/user/userDetailsSlice';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

let height: number;
let sentHeight: number;
let requestHeight: number;

const Requests = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.userDetail);

  useEffect(() => {
    height = document.getElementsByClassName("height")[0].clientHeight;
    sentHeight = height/2;
    requestHeight = height - sentHeight;
    dispatch(fetchRequests());  
  }, [dispatch]);

  
  useEffect(() => {
    if (userDetails.method === "requests"){
      userDetailActions.setStatus("idle");
      userDetailActions.setMethod("idle");
    }
  }, [userDetails]);

  const incomingCancelHandler = (e: React.MouseEvent<SVGSVGElement>, username: String, chatroom: String) => {
    dispatch(userDetailActions.rejectIncomingRequest({username, chatroom}));
  };
  
  const acceptHandler = (e: React.MouseEvent<SVGSVGElement>, username: String, chatroom: String) => {
    console.log(username, chatroom)
    dispatch(userDetailActions.acceptRequest({username, chatroom}));
  };
  
  const outgoingCancelHandler = (e: React.MouseEvent<SVGSVGElement>, username: String, chatroom: String) => {
    dispatch(userDetailActions.rejectOutgoingRequest({username, chatroom}));
  };

  return (
    <Stack direction = "column" justifyContent="center" style = {{height: height, backgroundColor: "#1e1a29", color: "#7f8054"}} textAlign="center" spacing = {2}>
      <Stack direction = "column" spacing = {1} style = {{height: requestHeight, overflowY: "scroll"}}>
        <h3>Pending Requests</h3>
        {userDetails.Requests.map((x, i) => {
          return !x.flow ?  
          (
            <Stack key = {i} direction = "row" justifyContent="space-between">
              <p>{x.chatroom}-{x.username}</p>
              <Stack direction = "row" spacing={2}>
                <DoneIcon onClick = {(e) => {acceptHandler(e, x.username, x.chatroom)}} />
                <CancelIcon onClick = {(e) => {incomingCancelHandler(e, x.username, x.chatroom)}} />
              </Stack>
            </Stack>
          ): null
        })}
      </Stack>
      <Stack direction = "column" spacing = {1} style = {{height: sentHeight, overflowY: "scroll"}}>
        <h3>Sent Requests</h3>
        {userDetails.Requests.map((x, i) => {
          return x.flow ? (
            <Stack key = {i} direction = "row" justifyContent="space-between">
              <p>{x.chatroom}-{x.username}</p>
              <CancelIcon onClick = {(e) => {outgoingCancelHandler(e, x.username, x.chatroom)}} />
            </Stack>
          ): null
        })}
      </Stack>
    </Stack>  
  )
}

export default Requests