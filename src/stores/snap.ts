import { defineStore } from "pinia";

export const useSnapStore = defineStore({
  id: "snap-store",
  state: () => ({
    innerWidth: 0,
    scrollTop: 0,
    snapWindowLeft: [] as number[],
    isShowSnapLeft: false,
    isShowSnapTop: false,
    snapWidth: {
      isShow: false,
      left: 0,
      right: 0,
    },
    snapTop: {
      isShow: false,
      hasSetValue: false,
      top: 0,
    },
  }),

  getters: {
    getSnapWidth(state) {
      return state.snapWidth;
    },
  },

  actions: {
    updateSnapWindowLeft(snaps: number[]) {
      this.snapWindowLeft.push(...snaps);
    },
    updateInnerWidth(innerWidth: number) {
      this.innerWidth = innerWidth;
    },
    updateScrollTop(scrollTop: number) {
      this.scrollTop = scrollTop;
    },
    updateIsShowSnapLeft(isShowSnapLeft: boolean) {
      this.isShowSnapLeft = isShowSnapLeft;
    },
    updateIsShowSnapTop(isShowSnapTop: boolean) {
      this.isShowSnapTop = isShowSnapTop;
    },
    updateSnapTop(data: {
      isShow: boolean;
      hasSetValue: boolean;
      top: number;
    }) {
      this.snapTop = data;
    },

    hideSnap() {
      this.isShowSnapTop = false;
      this.snapTop.isShow = false;
      this.snapWidth.isShow = false;
    },
  },
});
