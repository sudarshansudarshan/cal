import { RootState } from "@/redux/store";

export const selectCurrentVideo = (state: RootState) => state.videos?.currentVideo ?? null;
export const selectIsLoading = (state: RootState) => state.videos?.isLoading ?? false;
export const selectVideoError = (state: RootState) => state.videos?.error ?? null;