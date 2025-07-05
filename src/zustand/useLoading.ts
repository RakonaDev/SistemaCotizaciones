'use client'

import { create } from "zustand";

interface LoadingInterface {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoading = create<LoadingInterface>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}))