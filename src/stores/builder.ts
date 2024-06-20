import type { ElementLadi } from "@/models/element.model";
import type { ISection } from "@/models/section.model";
import { defineStore } from "pinia";

export const useBuildStore = defineStore({
  id: "build-store",
  state: () => ({
    count: 10,
    sectionArray: [] as ISection[],
    sectionArrayInViewPort: [] as ISection[],
    snapSectionNumber: [] as number[],
    sectionActiveIndex: null as unknown as number | null,
    elementActiveIndex: null as unknown as number | null,
    elementActive: null as ElementLadi | null,
    elementSnapTop: [] as number[],
    elementInViewPort: [] as ElementLadi[],
    scrollTop: 0,
    innerWidth: 0,
  }),
  getters: {
    getSectionArray(state) {
      return state.sectionArray;
    },
    getCount(state) {
      return state.count;
    },
    getHeightSection(state) {
      return (sectionIndex: number) => state.sectionArray[sectionIndex].height;
    },
    getIndexElementByid(state) {
      return (id: number) =>
        state.sectionArray.findIndex((item) => item.id === id);
    },
    getSnapSectionNumber(state) {
      return state.snapSectionNumber;
    },
  },
  actions: {
    addNewSection(indexSectionClick: number, section: ISection) {
      this.sectionArray = [
        ...this.sectionArray.slice(0, indexSectionClick + 1),
        section,
        ...this.sectionArray.slice(indexSectionClick + 1),
      ];
      this.setPreHeight();
      this.setSectionInViewPort();
      // this.setElementInViewPort();
    },

    setPreHeight() {
      let initValue = 0;
      for (let i = 1; i < this.sectionArray.length; i++) {
        initValue += this.sectionArray[i - 1].height;
        this.sectionArray[i].preHeight = initValue;
      }
      this.snapSectionNumber = this.sectionArray.map(
        (item) => item.preHeight + item.height
      );
    },

    setSectionInViewPort() {
      for (let i = 0; i < this.sectionArray.length; i++) {
        const section = this.sectionArray[i];
        if (section.height + section.preHeight >= this.scrollTop) {
          this.sectionArray[i].isInViewPort = true;
        }

        if (section.height + section.preHeight < this.scrollTop) {
          this.sectionArray[i].isInViewPort = false;
        }
      }
      this.sectionArrayInViewPort = this.sectionArray.filter(
        (item) => item.isInViewPort
      );
    },

    setElementInViewPort() {
      this.elementInViewPort.length = 0;
      this.sectionArrayInViewPort.forEach((section) => {
        section.element.forEach((ele) => {
          console.log(ele);
          if (ele.top + section.preHeight > this.scrollTop) {
            this.elementInViewPort.push(ele);
          }
        });
      });
    },

    updateScrollTop(scrollTop: number) {
      this.scrollTop = scrollTop;
    },

    updateInnerWidth(innerWidth: number) {
      this.innerWidth = innerWidth;
    },

    updateSectionIndexActive(index: number | null) {
      this.sectionActiveIndex = index;
    },

    updateSectionHeight(index: number, height: number) {
      this.sectionArray[index].height = height;
      this.setPreHeight();
    },

    updateSectionHeightStopResizeSection(id: number, value: number) {
      const index = this.sectionArray.findIndex((item) => item.id === id);
      if (index !== -1) {
        const delta = value - this.sectionArray[index].height;
        for (let i = index; i < this.sectionArray.length; i++) {
          this.sectionArray[index].preHeight += delta;
        }
      }
    },

    updateMaxBottomToTop(index: number, id: number, value: number) {
      let newValue = value;
      const oldId = this.sectionArray[index]?.maxBottomToTop?.id;
      if (oldId && id !== oldId) {
        newValue = Math.max(
          this.sectionArray[index].maxBottomToTop.value || 0,
          value
        );
      }
      this.sectionArray[index].maxBottomToTop = {
        id,
        value: newValue,
      };
    },

    updateElementIndexActive(index: number | null) {
      this.elementActiveIndex = index;
    },

    updateElementTop(
      sectionIndex: number,
      elementIndex: number,
      deltalY: number
    ) {
      this.sectionArray;
    },

    updateIsEditting(
      sectionIndex: number,
      elementIndex: number,
      isEditting: boolean
    ) {
      this.sectionArray[sectionIndex].element[elementIndex].isEditting =
        isEditting;
    },

    updateDraggable(
      sectionIndex: number,
      elementIndex: number,
      draggable: boolean
    ) {
      this.sectionArray[sectionIndex].element[elementIndex].draggable =
        draggable;
    },

    updateIsHovering(
      sectionIndex: number,
      elementIndex: number,
      isHovering: boolean
    ) {
      this.sectionArray[sectionIndex].element[elementIndex].isHovering =
        isHovering;
    },

    addNewElement(data: { sectionIndex: number; element: ElementLadi }) {
      this.sectionArray[data.sectionIndex].element?.push(data.element);
      this.setElementInViewPort();
    },

    updateCount(count: number) {
      this.count = count;
    },
  },
});
