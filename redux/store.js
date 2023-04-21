import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authSlice } from './auth/authReducer';
// import storage from 'redux-persist/lib/storage';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import hardSet from 'redux-persist/es/stateReconciler/hardSet';


// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   stateReconciler: hardSet,
//   // blacklist: ['authorisation'],
// }

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
});

// const persistContactsReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer:rootReducer,
  // reducer: persistContactsReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

// export const persistor = persistStore(store);

// export const store = configureStore({
//   reducer: rootReducer,
// });