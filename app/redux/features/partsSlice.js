"use client";

import { createSlice } from "@reduxjs/toolkit";
import carPartsData from "../../data/carParts.json";

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const initialState = {
  parts: carPartsData.parts,
  userParts: [],
  filteredParts: [],
  postalCode: "",
  allParts: shuffleArray([...carPartsData.parts]), // Initialize with shuffled array
};

const partsSlice = createSlice({
  name: "parts",
  initialState,
  reducers: {
    setFilteredParts: (state, action) => {
      // If action.payload is already filtered/sorted, use it directly
      if (
        action.payload &&
        action.payload.length > 0 &&
        action.payload !== state.allParts
      ) {
        state.filteredParts = action.payload;
      } else {
        // Otherwise use all parts (which are already shuffled)
        state.filteredParts = [...state.allParts];
      }
    },
    addUserPart: (state, action) => {
      const newPart = {
        ...action.payload,
        id: Date.now().toString(),
        seller: {
          name: "User Listing",
          isVerified: false,
          location: state.postalCode
            ? `Near ${state.postalCode}`
            : "Location not specified",
          postalCode: state.postalCode,
        },
      };

      state.userParts.push(newPart);
      state.allParts.push(newPart);

      if (state.filteredParts.length > 0) {
        state.filteredParts.push(newPart);
      }
    },
    setPostalCode: (state, action) => {
      state.postalCode = action.payload;
    },
    refreshAllParts: (state) => {
      // Combine and shuffle all parts
      state.allParts = shuffleArray([...state.parts, ...state.userParts]);
    },
  },
});

export const { setFilteredParts, addUserPart, setPostalCode, refreshAllParts } =
  partsSlice.actions;
export default partsSlice.reducer;
