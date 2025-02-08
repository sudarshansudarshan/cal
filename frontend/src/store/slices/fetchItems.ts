// src/store/slices/sectionItemsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiService } from '../ApiServices/LmsEngine/DataFetchApiServices'

// Define async thunk using RTK Query endpoint initiation
export const fetchSectionItemsWithAuth = createAsyncThunk(
  'sectionItems/fetchSectionItemsWithAuth',
  async ({ sectionId }, { dispatch, rejectWithValue }) => {
    const response = await dispatch(
      apiService.endpoints.fetchSectionItemsWithAuth.initiate({ sectionId })
    )
    if (response.error) {
      console.error('Error fetching section items:', response.error)
      return rejectWithValue('Failed to fetch section items')
    }
    return response.data // Ensure this matches the expected structure in your state
  }
)

const sectionItemsSlice = createSlice({
  name: 'sectionItems',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectionItemsWithAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSectionItemsWithAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items // Assume the payload has an 'items' array
      })
      .addCase(fetchSectionItemsWithAuth.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to fetch section items'
      })
  },
})

export default sectionItemsSlice.reducer
