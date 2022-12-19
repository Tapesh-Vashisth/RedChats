import express from 'express';
import mongoose from 'mongoose';

const userschema = new mongoose.Schema({
    email: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: false
    },
    refreshToken: String
});


const userModel = mongoose.model('User', userschema)

export default userModel;


