import { create } from 'zustand';
import { MarketingTool } from './types';

interface StoreState {
  tools: MarketingTool[];
  setState: (key: keyof StoreState, value: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  tools: [],
  setState: (key, value) => set((state) => ({ ...state, [key]: value })),
}));