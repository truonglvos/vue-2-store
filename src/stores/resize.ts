import { defineStore } from "pinia";

export const useResizeStore = defineStore({
  id: "resize-state",
  state: () => ({
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    originalX: 0,
    edgeResize: "",
  }),
  actions: {
    updateState(data: {
      initialX?: number;
      initialY?: number;
      currentX?: number;
      currentY?: number;
      edgeResize?: string;
      originalX?: number;
    }) {
      this.initialX = data.initialX || 0;
      this.initialY = data.initialY || 0;
      this.currentX = data.currentX || 0;
      this.currentY = data.currentY || 0;
      this.originalX = data.originalX || 0;
      if (data.edgeResize) {
        this.edgeResize = data.edgeResize;
      }
    },
  },
});
