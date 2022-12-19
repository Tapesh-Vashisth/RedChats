import React, {useState, useEffect} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import { Grid} from '@mui/material/';
import "../../styles/LoginSign.css";
import TryIcon from '@mui/icons-material/Try';
import {userActions} from "../../features/user/userSlice";
import { fetchInUser } from "../../features/user/userSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

const inputStyle = {
    padding: "4px",
    fontSize: "12px",
    border: "none",
    fontFamily: "Poppins",
    fontWeight: "bold"
}

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

const Login = () => {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [email, setemail] = useState <string> ("");
    const [password, setpassword] = useState <string> ("");

    const inputhandler = (event: React.ChangeEvent<HTMLInputElement>, setinput: (val: string) => void): void => {
        setinput(event!.target!.value);
    }

    useEffect(() => {
        if (user.status !== "idle"){
            if (user.login){
                navigate("/");
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user.method === "login" && user.status === "fulfilled"){
            dispatch(userActions.setStatus("idle"));
            dispatch(userActions.setMethod("idle"));
            dispatch(userActions.startConnecting(true));
            navigate("/");
        }else if(user.method === "login" && user.status === "rejected"){
            dispatch(userActions.setStatus("idle"));
            dispatch(userActions.setMethod("idle"));
            alert("wrong credentails");
        }
    }, [user, dispatch, navigate])


    const submithandler = (event: React.FormEvent<HTMLFormElement>) => {
        dispatch(fetchInUser({email: email, password: password}));
        event.preventDefault();   
    }

    return (
        <Grid container className = "main-container" rowSpacing={0} direction = "row" columns={{xs: 9, sm: 6, md: 4}} justifyContent="center" alignItems="center">
            <Grid item container xs = {9} sm = {6} md = {4} className = "log-box" rowSpacing={3} justifyContent = "center">
                <Grid style = {{color: "#4883db"}} item xs = {12} alignItems = "center" justifyContent="center">
                    <TryIcon fontSize="large" />
                    <h2>Login to Chatter</h2>
                </Grid>
                <Grid item xs = {11} style = {{borderRadius: "6px"}} className = "inputsContainer">  
                    <form className="inputs" onSubmit = {(event) => {submithandler(event)}}>
                        <div>
                            <p>Enter your email</p>
                            <input type="email" style = {inputStyle} value = {email} onChange = {(event) => {inputhandler(event, setemail)}}></input>
                        </div>
                        <div>
                            <p>Enter your password</p>
                            <input type="password" style = {inputStyle} value = {password} onChange = {(event) => {inputhandler(event, setpassword)}}></input>
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <button style={buttonStyle} type="submit">Log in</button>
                        </div>
                    </form>
                </Grid>
                <Grid style = {{color: "#2b538f"}} item xs = {10} justifyContent = "center" textAlign="center" className="otherway">
                    <p>New to chatter? <NavLink style = {{color: "#443669"}} to = "/signup">Create an Account</NavLink></p>
                </Grid>
            </Grid>

        </Grid>
    );
}

export default Login;