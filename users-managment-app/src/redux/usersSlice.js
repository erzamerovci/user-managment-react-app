import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      return action.payload;
    },
    addUser: (state, action) => {
      state.unshift(action.payload); 
    },
    updateUser: (state, action) => {
      const { id, updatedUser } = action.payload;
      const index = state.findIndex((u) => u.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...updatedUser };
      }
    },
    deleteUser: (state, action) => {
      return state.filter((u) => u.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
