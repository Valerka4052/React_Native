import { createSlice } from '@reduxjs/toolkit';
import { signUp, signIn, refreshStatus, signOutUser } from '../auth/authOprations';
import { Alert } from 'react-native';



export const authSlice = createSlice({
    name: 'authorisation',
    initialState: {
        userId: null,
        nickName: null,
        email: null,
        devicePhoto: null,
        stateChange: false,
        profileImage: 'https://firebasestorage.googleapis.com/v0/b/rn-social2.appspot.com/o/posts%2Fuser.png?alt=media&token=9dac57f2-a3fb-4c18-89a1-f450d301000e',
    },
    reducers: {
        takeDevicePhoto(state, { payload }) { return { ...state, devicePhoto: payload } },
        photoFromFireBase(state, { payload }) { return { ...state, profileImage: payload.photo, nickName: payload.nameP } },
        inRegister(state) { return { ...state, stateChange: true, } },
        inRegisterWithoutPhoto(state, { payload }) { return { ...state, nickName: payload } },
    },
    extraReducers: builder => {
        builder
            .addCase(signUp.fulfilled, (state, { payload }) => {
                console.log('payload', payload);
                return { ...state, userId: payload.userId, email: payload.email, };
            })
            .addCase(signUp.rejected, (state) => {
                // console.log('payload',payload);
                return Alert.alert('Что-то пошло не так');
            })
            .addCase(signIn.fulfilled, (state, { payload }) => {
                console.log(payload);
                if (!payload) return;
                if (!payload.photoURL) {
                    return { ...state, userId: payload.userId, nickName: payload.nickName, email: payload.email, stateChange: true };
                }
                return { ...state, userId: payload.userId, nickName: payload.nickName, profileImage: payload.photoURL, email: payload.email, stateChange: true };
            })
            .addCase(refreshStatus.fulfilled, (state, { payload }) => {
                console.log('payload', payload);
                if (!payload) return;
                const { userId, nickName, email, profileImage } = payload;
                console.log(payload);
                return { ...state, userId: userId, nickName: nickName, email: email, profileImage: profileImage, stateChange: true };
            })
            .addCase(signOutUser.fulfilled, (state) => {
                return { ...state, userId: null, nickName: null, email: null, profileImage: null, stateChange: false };
            })
    },
});
export const { takeDevicePhoto, photoFromFireBase,  inRegister,inRegisterWithoutPhoto } = authSlice.actions;
