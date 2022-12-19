import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import {NavLink} from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import MenuComp from './MenuComp';
import {useAppSelector, useAppDispatch} from "../../store/hooks";
import {userActions} from "../../features/user/userSlice";

interface Props {
  window?: () => Window;
  toggleVisibility: (to: 0 | 1 | 2) => void
}


export default function DrawerAppBar(props: Props) {
  const navItems = [{item: <ChatIcon onClick = {() => {props.toggleVisibility(0)}} />, to: "/chats"}, {item: <GroupIcon onClick = {() => {props.toggleVisibility(0)}} />, to: "/requests"}, {item: <PersonAddIcon onClick = {() => {props.toggleVisibility(0)}} />, to: "/addfriend"}, {item: <MenuComp />, to: ""}];
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  
  const activeHandler = () => {
    dispatch(userActions.toggleActive());
  }

  return (
    <nav>
      <AppBar component="nav" style = {{position: "static", backgroundColor: "#1d1336"}}>
        <Toolbar sx = {{justifyContent: {xs: "center"}}}>
          <Box sx={{ display: { xs: 'flex' }, alignItems: "center" }}>
            {navItems.map((item, i) => (
              <NavLink key={i} to = {item.to}>
                <Button sx={{ color: '#fff' }}>
                  {item.item}
                </Button>
              </NavLink>
            ))}
            <Button sx={{ color: '#fff' }} onClick = {activeHandler}>
              <CircleIcon style={user.active ? {color: "green"}: {color: "red"}}/>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </nav>
  );
}

