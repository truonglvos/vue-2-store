import { MenuLeft } from "@/constants/menu-left.constant";
import { defineStore } from "pinia";

export const useMenuLeftStore = defineStore({
  id: "menu-left",
  state: () => ({
    menuLeft: MenuLeft,
  }),
  getters: {
    getMenuLeft(state) {
      return state.menuLeft;
    },
  },
  actions: {
    toggleMenu(index: number) {
      const indexOpen = this.menuLeft.findIndex((e) => e.isSelected === true);
      if (indexOpen != -1 && indexOpen != index) {
        this.menuLeft[indexOpen].isSelected =
          !this.menuLeft[indexOpen].isSelected;
      }
      this.menuLeft[index].isSelected = !this.menuLeft[index].isSelected;
    },
  },
});
