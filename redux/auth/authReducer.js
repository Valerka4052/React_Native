import { createSlice } from '@reduxjs/toolkit';
import { signUp, signIn, refreshStatus, signOutUser } from '../auth/authOprations';
import { Alert } from 'react-native';



export const authSlice = createSlice({
    name: 'authorisation',
    initialState: {
        isLoading: false,
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
            .addCase(signUp.pending, (state, { payload }) => {
                // console.log('payload', payload);
                return { ...state, isLoading: true, };
            })
            .addCase(signIn.pending, (state, { payload }) => {
                // console.log('payload', payload);
                return { ...state, isLoading: true, };
            })
            .addCase(signOutUser.pending, (state, { payload }) => {
                // console.log('payload', payload);
                return { ...state, isLoading: true, };
            })
            // .addCase(refreshStatus.pending, (state, { payload }) => {
            //     console.log('payload', payload);
            //     return { ...state, isLoading: true, };
            // })
            .addCase(signUp.fulfilled, (state, { payload }) => {
                // console.log('payload', payload);
                if (!payload) return { ...state, isLoading: false };
                return { ...state, userId: payload.userId, email: payload.email, isLoading: false, };
            })
            .addCase(signUp.rejected, (state) => {
                Alert.alert('Что-то пошло не так')
                return { ...state, isLoading: false, };
            })
            .addCase(signIn.rejected, (state) => {
                Alert.alert('Что-то пошло не так')
                return { ...state, isLoading: false, };
            })
            .addCase(signIn.fulfilled, (state, { payload }) => {
                // console.log(payload);
                if (!payload) return { ...state, isLoading: false };
                if (!payload.photoURL) {
                    return { ...state, userId: payload.userId, nickName: payload.nickName, email: payload.email, stateChange: true, isLoading: false };
                }
                return { ...state, userId: payload.userId, nickName: payload.nickName, profileImage: payload.photoURL, email: payload.email, stateChange: true, isLoading: false };
            })
            .addCase(refreshStatus.fulfilled, (state, { payload }) => {
                // console.log('payload', payload);
                if (!payload) return  { ...state, isLoading: false }; ;
                const { userId, nickName, email, profileImage } = payload;
                // console.log(payload);
                return { ...state, userId: userId, nickName: nickName, email: email, profileImage: profileImage, stateChange: true, isLoading: false };
            })
            .addCase(signOutUser.fulfilled, (state) => {
                // console.log('sucsess out');
                return { ...state, userId: null, nickName: null, email: null, profileImage: null, stateChange: false, isLoading: false };
            })
    },
});
export const { takeDevicePhoto, photoFromFireBase,  inRegister,inRegisterWithoutPhoto } = authSlice.actions;
