import { create } from "zustand";
import type { AssessmentItem } from "@/lib/assessment/items";

interface ItemResponse {
  itemId: string;
  response: string;
  responseTimeMs: number;
  confidence?: number;
}

interface AssessmentState {
  token: string | null;
  assessmentId: string | null;
  blockIndex: number;
  itemIndex: number;
  items: AssessmentItem[];
  responses: Map<string, ItemResponse>;
  blockStartTime: number;
  itemStartTime: number;

  // Actions
  initBlock: (token: string, assessmentId: string, blockIndex: number, items: AssessmentItem[]) => void;
  submitResponse: (itemId: string, response: string, confidence?: number) => void;
  advanceItem: () => boolean; // returns false if block is complete
  getProgress: () => { current: number; total: number };
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  token: null,
  assessmentId: null,
  blockIndex: 0,
  itemIndex: 0,
  items: [],
  responses: new Map(),
  blockStartTime: Date.now(),
  itemStartTime: Date.now(),

  initBlock: (token, assessmentId, blockIndex, items) => {
    // Restore from sessionStorage if available
    const storageKey = `aci-assess-${token}-${blockIndex}`;
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;
    let restoredResponses = new Map<string, ItemResponse>();
    let restoredItemIndex = 0;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        restoredResponses = new Map(parsed.responses || []);
        restoredItemIndex = parsed.itemIndex || 0;
      } catch {
        // ignore parse errors
      }
    }

    set({
      token,
      assessmentId,
      blockIndex,
      itemIndex: restoredItemIndex,
      items,
      responses: restoredResponses,
      blockStartTime: Date.now(),
      itemStartTime: Date.now(),
    });
  },

  submitResponse: (itemId, response, confidence) => {
    const state = get();
    const responseTimeMs = Date.now() - state.itemStartTime;

    const newResponses = new Map(state.responses);
    newResponses.set(itemId, { itemId, response, responseTimeMs, confidence });

    set({ responses: newResponses });

    // Persist to sessionStorage
    if (typeof window !== "undefined" && state.token) {
      const storageKey = `aci-assess-${state.token}-${state.blockIndex}`;
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          itemIndex: state.itemIndex,
          responses: Array.from(newResponses.entries()),
        })
      );
    }

    // Send to server (fire and forget)
    if (state.token) {
      fetch(`/api/assess/${state.token}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          itemType: state.items[state.itemIndex]?.itemType || "MULTIPLE_CHOICE",
          response,
          responseTimeMs,
          confidence,
        }),
      }).catch(() => {});
    }
  },

  advanceItem: () => {
    const state = get();
    const nextIndex = state.itemIndex + 1;

    if (nextIndex >= state.items.length) {
      return false; // block complete
    }

    set({ itemIndex: nextIndex, itemStartTime: Date.now() });

    // Update sessionStorage
    if (typeof window !== "undefined" && state.token) {
      const storageKey = `aci-assess-${state.token}-${state.blockIndex}`;
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          itemIndex: nextIndex,
          responses: Array.from(state.responses.entries()),
        })
      );
    }

    return true;
  },

  getProgress: () => {
    const state = get();
    return { current: state.itemIndex + 1, total: state.items.length };
  },
}));
