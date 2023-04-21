import { createSlice } from '@reduxjs/toolkit';
import { signUp, signIn, refreshStatus, signOutUser } from '../auth/authOprations';


export const authSlice = createSlice({
    name: 'authorisation',
    initialState: {
        userId: null,
        nickName: null,
        email: null,
        devicePhoto: null,
        stateChange: false,
        profileImage: null,
    },
    reducers: {
        takeDevicePhoto(state, { payload }) { return { ...state, devicePhoto: payload } },
        photoFromFireBase(state, { payload }) { return { ...state, profileImage: payload } },
    },
    extraReducers: builder => {
        builder
            .addCase(signUp.fulfilled, (state, { payload }) => {
                console.log(payload);
                return { ...state, userId: payload.userId, email: payload.email, nickName: payload.nickName, stateChange: true };
            })
            .addCase(signIn.fulfilled, (state, { payload }) => {
                console.log(payload);
                if (!payload) return;
                return { ...state, userId: payload.userId, nickName: payload.nickName, profileImage: payload.photoURL, email: payload.email, stateChange: true };
            })
            .addCase(refreshStatus.fulfilled, (state, { payload }) => {
                if (!payload) return;
                const { userId, nickName, email, profileImage } = payload;
                                console.log(payload);
                return { ...state, userId: userId, nickName: nickName, email: email,profileImage:profileImage, stateChange: true };
            })
            .addCase(signOutUser.fulfilled, (state) => {
                return { ...state, userId: null, nickName: null, email: null, stateChange: false };
            })
    },
});
export const { takeDevicePhoto, photoFromFireBase } = authSlice.actions;
