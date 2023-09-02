import { createSlice } from '@reduxjs/toolkit';

const peerSlice = createSlice({
  name: 'peer',
  initialState: {
    id: '',
  },
  reducers: {
    updatePeerIDCall: (state, action) => {
      state.id = action.payload;
    },
  },
});
export const { updatePeerIDCall } = peerSlice.actions;
export default peerSlice.reducer;
