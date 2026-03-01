import { create } from "zustand";

interface AppState {
  mode: "live" | "tutorial";
  tutorialStep: number | null;
  enterTutorial: () => void;
  exitTutorial: () => void;
  setTutorialStep: (step: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: "live",
  tutorialStep: null,
  enterTutorial: () => set({ mode: "tutorial", tutorialStep: 1 }),
  exitTutorial: () => set({ mode: "live", tutorialStep: null }),
  setTutorialStep: (step) => set({ tutorialStep: step }),
}));
