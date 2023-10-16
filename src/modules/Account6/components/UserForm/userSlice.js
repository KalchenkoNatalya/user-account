import { selectToken } from '@/redux/slices/authSlice';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { useSelector } from 'react-redux';

const initialState = {
  userData: {
    username: '',
    birthday: '',
    email: '',
    phone: '',
    skype: '',
    avatarURL: '',
  },
  isLoading: false,
  error: null,
};
export const $instance = axios.create({
  baseURL: 'https://gt-project.onrender.com/api',
  // baseURL: 'http:localhost:3333/api',
  // baseURL: 'https://connections-api.herokuapp.com/'
});

// export const setToken = (token) => {
//   $instance.defaults.headers['Authorization'] = `Bearer ${token}`;
// };

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async () => {
    const response = await $instance.get('/users/current');
    return response.data;
  },
);

// export const refreshUserThunk = createAsyncThunk(  //Танина
//   'auth/refresh',
//   async (_, thunkApi) => {
//     const state = thunkApi.getState();
//     const token = state.auth.token;

//     try {
//       setToken(token);
//       const { data } = await $instance.get('/users/current', token);
//       return data;
//     } catch (error) {
//       return thunkApi.rejectWithValue(error.message);
//     }
//   },
// );/////
export const updateUserData = createAsyncThunk(
  'auth/updateUserData',
  async (formData, thunkApi) => {
    const token = selectToken(thunkApi.getState());
    console.log(token);

    try {
      const response = await $instance.patch('/users/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDataField: (state, action) => {
      const { field, value } = action.payload;
      state.userData[field] = value;
      console.log('field:', field);
      console.log('value:', value);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.userData = action.payload;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateUserDataField } = userSlice.actions;

export const selectUserUsername = (state) => state.user.userData.username;
export const selectUserBirsday = (state) => state.user.userData.birthday;
export const selectUserEmail = (state) => state.user.userData.email;
export const selectUserPhone = (state) => state.user.userData.phone;
export const selecUserSkype = (state) => state.user.userData.skype;
export const selecUseravatarURL = (state) => state.user.userData.avatarURL;

export const userReducer = userSlice.reducer;
