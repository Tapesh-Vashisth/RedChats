import React, {useState, useEffect} from "react";
import {Grid} from '@mui/material/';
import TryIcon from '@mui/icons-material/Try';
import { useNavigate } from "react-router-dom";
import "../../styles/LoginSign.css";
import { fetchUpUser } from "../../features/user/userSlice";
import { userActions } from "../../features/user/userSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { NavLink } from "react-router-dom";

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

const Signup = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);
    const [email, setemail] = useState<string>("");
    const [name, setname] = useState<string>("");
    const [password, setpassword] = useState<string>("");

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user.status !== "idle"){
            if (user.login){
                navigate("/");
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user.method === "signup" && user.status === "fulfilled"){
            dispatch(userActions.setStatus("idle"));
            dispatch(userActions.setMethod("idle"));
            dispatch(userActions.startConnecting(true))
            navigate("/");
        }else if(user.method === "signup" && user.status === "rejected"){
            dispatch(userActions.setStatus("idle"));
            dispatch(userActions.setMethod("idle"));
            alert("some error occured");
        }
    }, [user, dispatch, navigate]);

    const inputhandler = (event: React.ChangeEvent<HTMLInputElement>, setinput: (val: string) => void): void => {
        setinput(event!.target!.value);
        console.log(email);
    }

    const Submithandler = (event: React.FormEvent<HTMLFormElement>) => {
        dispatch(fetchUpUser({email, username: name, password}));
        event.preventDefault();
    }


    return (
        <Grid container className = "main-container" rowSpacing={0} direction = "row" columns={{xs: 9, sm: 6, md: 4}} justifyContent="center" alignItems="center">
            <Grid item container xs = {9} sm = {6} md = {4} className = "log-box" rowSpacing={3} justifyContent = "center">
                <Grid item style = {{color: "#4883db"}} xs = {12} alignItems = "center" justifyContent="center">
                    <TryIcon fontSize="large" />
                    <h2>Sign up to Chatter</h2>
                </Grid>
                <Grid item xs = {11} className = "inputsContainer" style = {{borderRadius: "6px"}}>  
                    <form className="inputs" onSubmit = {(event) => {Submithandler(event)}}>
                        <div>
                            <p>Enter your email</p>
                            <input type="email" style = {inputStyle} value = {email} onChange = {(event) => {inputhandler(event, setemail)}}></input>
                        </div>
                        <div>
                            <p>Enter your name</p>
                            <input type="text" style = {inputStyle} value = {name} onChange = {(event) => {inputhandler(event, setname)}}></input>
                        </div>
                        <div>
                            <p>Enter your password</p>
                            <input type="password" style = {inputStyle} value = {password} onChange = {(event) => {inputhandler(event, setpassword)}}></input>
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <button type="submit" style = {buttonStyle}>Create Account</button>
                        </div>
                    </form>
                </Grid>
                <Grid item xs = {10} justifyContent = "center" textAlign="center" className="otherway">
                    <NavLink style = {{color: "#443669"}} to = "/login">Login</NavLink>
                </Grid>
            </Grid>

        </Grid>
    );
}

export default Signup;