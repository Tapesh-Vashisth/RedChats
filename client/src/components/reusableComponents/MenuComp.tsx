import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListIcon from '@mui/icons-material/List';
import { useAppDispatch } from '../../store/hooks';
import { fetchOutUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../features/user/userSlice';
import { userDetailActions } from '../../features/user/userDetailsSlice';
import { chatActions } from '../../features/chat/chatsSlice';

export default function MenuComp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }
 
  const handleCloseLogOut = () => {
    dispatch(fetchOutUser()).then(() => {
      dispatch(userActions.reset());
      dispatch(userDetailActions.reset());
      dispatch(chatActions.reset());
      navigate("/login");
    }).catch((err: any) => {
      alert("error while logging out!");
    });
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        style = {{color: "white"}}
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <ListIcon />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleCloseLogOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
