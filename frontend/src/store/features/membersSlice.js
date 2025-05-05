import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (state, action) => {
      return action.payload;
    },
    addMember: (state, action) => {
      state.push(action.payload);
    },
    editMember: (state, action) => {
      const { nro_socio } = action.payload;
      const foundMember = state.find((member) => member.nro_socio === nro_socio);
      if (foundMember) {
        Object.assign(foundMember, action.payload);
      }
    },
    deactivateMember: (state, action) => {
      const { nro_socio, estado } = action.payload;
      const member = state.find((m) => m.nro_socio === nro_socio);
      if (member) {
        member.estado = estado;
      }
    }
  },
});

export const { setMembers, addMember, editMember, deactivateMember } = membersSlice.actions;
export default membersSlice.reducer;