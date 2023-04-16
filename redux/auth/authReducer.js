import { createSlice } from '@reduxjs/toolkit';
import {signUp,signIn, refreshStatus, signOutUser, refreshUser} from '../auth/authOprations'


export const authSlice = createSlice({
    name: 'authorisation',
    initialState: {
        userId: null,
        nickName: null,
        stateChange: false,
    },
    reducers: {
        
    }, extraReducers: builder => {
        builder
            .addCase(signUp.pending, (state) => {
               
            })
            .addCase(signUp.fulfilled, (state, { payload }) => {
                console.log(payload);
                return { ...state, userId: payload.userId, nickName: payload.nickName, stateChange: true };
            })
            .addCase(signIn.fulfilled, (state, { payload }) => {
                console.log(payload);
                if(!payload)return
                return { ...state, userId: payload.userId, nickName: payload.nickName, stateChange: true };
            })
            .addCase(refreshStatus.fulfilled, (state, { payload }) => {
                if(!payload)return
                console.log(payload);
                return { ...state, userId: payload.userId, nickName: payload.nickName, stateChange: true };
            })
            .addCase(signOutUser.fulfilled, (state) => {
                return { ...state, userId: null, nickName: null, stateChange: false };
            })
           
    },
});

