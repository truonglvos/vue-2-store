<template>
  <div :ref="itemElement.idText" :style="{
    width: itemElement.width + 'px',
    height: itemElement.height + 'px',
    top: itemElement.top + 'px',
    left: itemElement.left + 'px',
  }" class="ladi-element" @click="$event.stopPropagation()" @mousedown.stop="
      mouseDownElement(
        indexSection,
        indexElement,
        itemElement.isEditting,
        builderStore.elementActiveIndex,
        itemElement,
        $event
      )
    " @mouseenter="mouseEnterElement" @mouseleave="mouseLeaveElement">
    <ButtonElement v-if="itemElement.elementType === menuChildEnum.BUTTON" :height="itemElement.height"
      :width="itemElement.width" :itemElement="itemElement" :indexSection="indexSection" :indexElement="indexElement"
      :isResizingEdge="itemElement.isResizingEdge" :applyCss="itemElement.applyCss"
      @on-update-draggable="updateDraggableElement" />
    <div v-if="itemElement.isHovering && !itemElement.isEditting" :data-id="itemElement.idText" data-locked="false"
      class="ladi-hover"></div>
    <div v-if="itemElement.isResizingEdge" :data-id="itemElement.idText" data-locked="false"
      class="ladi-selected ladi-size" :data-size="itemElement.width + 'x' + itemElement.height"></div>
    <div v-if="itemElement.isEditting" class="ladi-parent-selected-label">
      {{ itemElement.idText }}
    </div>
    <div v-if="itemElement.isEditting" class="ladi-parent-selected"></div>
    <template v-if="builderStore.elementActiveIndex === indexElement">
      <div @mousedown.stop="mouseDownResizeEdge(classResize, $event)" v-for="(classResize, index) of classResizes"
        :key="index" data-locked="false" class="ladi-resize" :class="classResize">
        <div class="ladi-resize-display"></div>
      </div>
    </template>
    <div v-if="itemElement.isResizingEdge" :data-id="itemElement.idText" data-locked="false" class="ladi-selected ladi-size"
      :data-size="
        itemElement.width + 'x' + itemElement.height
      "></div>
  </div>
</template>

<script lang="ts">
import ResizeEdge from "./ResizeEdge.vue";
import ButtonElement from "./ButtonElement.vue";
import { defineComponent } from "vue";
import { MenuChildAddNew } from "../constants/menu-left.constant";
import type { ElementLadi } from "../models/element.model";
import { useBuildStore } from "../stores/builder";
import { useResizeStore } from "../stores/resize";
import { useSnapStore } from "../stores/snap";
import type { ISnapLeftState, ISnapTopState } from "../models/snap.model";

export default defineComponent({
  components: {
    ResizeEdge,
    ButtonElement,
  },
  setup() {
    const builderStore = useBuildStore();
    const resizeStore = useResizeStore();
    const snapStore = useSnapStore();
    return {
      builderStore,
      resizeStore,
      snapStore,
    };
  },

  data() {
    return {
      menuChildEnum: MenuChildAddNew,
      classResizes: [
        "ladi-s-resize",
        "ladi-e-resize",
        "ladi-w-resize",
        "ladi-n-resize",
        "ladi-se-resize",
        "ladi-sw-resize",
        "ladi-nw-resize",
        "ladi-ne-resize",
      ],
      snapWindowLeft: [] as number[],
      timeOutId: 0,
      elementInViewPort: [] as ElementLadi[],
      snapSectionNumber: [] as number[]
    };
  },
  mounted() {
    this.snapWindowLeft = this.snapStore.snapWindowLeft;
  },
  methods: {
    mouseDownElement(
      sectionIndex: number,
      elementIndex: number,
      isEditting: boolean | undefined,
      elementActiveIndex: number | null,
      itemElement: ElementLadi,
      mouseEvent: MouseEvent
    ) {
      this.builderStore.updateElementIndexActive(elementIndex);
      this.builderStore.updateSectionIndexActive(sectionIndex);
      this.elementInViewPort = this.builderStore.elementInViewPort.filter(ele => ele.id !== this.itemElement.id);
      this.snapSectionNumber = this.builderStore.getSnapSectionNumber;
      if (!isEditting) {
        this.resizeStore.updateState({
          initialY: mouseEvent.clientY,
          initialX: mouseEvent.clientX,
        });
        document.addEventListener("mousemove", this.handleMouseMove),
        document.addEventListener("mouseup", this.handleMouseUp);
      }
    },
    handleMouseMove(mouseMoveEvent: MouseEvent) {
      let deltaY = mouseMoveEvent.clientY - this.resizeStore.initialY;
      let deltaX = mouseMoveEvent.clientX - this.resizeStore.initialX;
      this.resizeStore.updateState({
        initialY: mouseMoveEvent.clientY,
        initialX: mouseMoveEvent.clientX,
      });
      this.itemElement.top += deltaY;
      this.itemElement.left += deltaX;
      this.handleSnapLeft();
      // this.handleSnapTop();
      this.snapTopElement(this.itemElement, this.elementInViewPort, this.snapSectionNumber);
    },
    handleMouseUp() {
      this.builderStore.updateMaxBottomToTop(
        this.indexSection,
        this.itemElement.id,
        this.itemElement.height + this.itemElement.top
      );
      this.snapStore.hideSnap();
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },

    mouseEnterElement() {
      this.builderStore.updateIsHovering(
        this.indexSection,
        this.indexElement,
        true
      );
    },

    mouseLeaveElement() {
      this.builderStore.updateIsHovering(
        this.indexSection,
        this.indexElement,
        false
      );
    },

    mouseDownResizeEdge(classResize: string, mouseEvent: MouseEvent) {
      this.resizeStore.updateState({
        initialY: mouseEvent.clientY,
        initialX: mouseEvent.clientX,
        edgeResize: classResize,
      });
      this.itemElement.isResizingEdge = true;
      document.addEventListener("mousemove", this.mouseMoveResizeEdge),
      document.addEventListener("mouseup", this.mouseResizeEdgeUp);
    },

    mouseMoveResizeEdge(mouseMoveEvent: MouseEvent) {
      let deltaY = mouseMoveEvent.clientY - this.resizeStore.initialY;
      let deltaX = mouseMoveEvent.clientX - this.resizeStore.initialX;
      this.resizeStore.updateState({
        initialY: mouseMoveEvent.clientY,
        initialX: mouseMoveEvent.clientX,
      });
      this.snapTopElement(this.itemElement, this.elementInViewPort, this.snapSectionNumber);
      if (this.resizeStore.edgeResize === "ladi-e-resize") {
        this.itemElement.width += deltaX;
      }
      if (this.resizeStore.edgeResize === "ladi-s-resize") {
        // this.itemElement.height += deltaY;
        // this.itemElement.top = this.itemElement.top;
        if (!this.snapStore.isShowSnapTop){
          this.itemElement.height += deltaY;
        }
        this.handleSnapTop();
      }
      if (this.resizeStore.edgeResize === "ladi-w-resize") {
        // if(!this.snapStore.isShowSnapLeft){
          this.itemElement.width -= deltaX;
          this.itemElement.left += deltaX;
        // }
        this.handleSnapLeft(false);
      }
      if (this.resizeStore.edgeResize === "ladi-n-resize") {
        this.itemElement.height -= deltaY;
        this.itemElement.top += deltaY;
      }
      if (this.resizeStore.edgeResize === "ladi-se-resize") {
        this.itemElement.height += deltaY;
        this.itemElement.width += deltaX;
      }
      if (this.resizeStore.edgeResize === "ladi-sw-resize") {
        this.itemElement.width -= deltaX;
        this.itemElement.left += deltaX;
        this.itemElement.height += deltaY;
      }
      if (this.resizeStore.edgeResize === "ladi-nw-resize") {
        this.itemElement.width -= deltaX;
        this.itemElement.left += deltaX;
        this.itemElement.height -= deltaY;
        this.itemElement.top += deltaY;
      }
      if (this.resizeStore.edgeResize === "ladi-ne-resize") {
        this.itemElement.width += deltaX;
        this.itemElement.height -= deltaY;
        this.itemElement.top += deltaY;
      }
    },

    mouseResizeEdgeUp() {
      this.itemElement.isResizingEdge = false;
      this.builderStore.updateMaxBottomToTop(
        this.indexSection,
        this.itemElement.id,
        this.itemElement.height + this.itemElement.top
      );
      document.removeEventListener("mousemove", this.mouseMoveResizeEdge);
      document.removeEventListener("mouseup", this.mouseResizeEdgeUp);
    },

    updateDraggableElement(isDraggable: boolean) {
      if (!isDraggable) {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        this.builderStore.updateIsEditting(
          this.indexSection,
          this.indexElement,
          true
        );
        this.builderStore.updateDraggable(
          this.indexSection,
          this.indexElement,
          false
        );
      }
      if (isDraggable) {
        this.builderStore.updateIsEditting(
          this.indexSection,
          this.indexElement,
          false
        );
        this.builderStore.updateDraggable(
          this.indexSection,
          this.indexElement,
          true
        );
      }
    },

    // show hidden snap
    setSnapLeft(left: number, arr: number[]): ISnapLeftState {
      const elemenWidth = this.itemElement.width;
      const rightElementLeft = left + elemenWidth;
      const isShow = arr.some(
        (value) =>
          Math.abs(value - left) <= 2 || Math.abs(value - rightElementLeft) <= 2
      );

      let leftSnapPosition = 0;
      let plusWidth = false;
      for (const value of arr) {
        if (Math.abs(value - left) <= 2) {
          leftSnapPosition = value;
          plusWidth = false;
          break;
        }
        if (Math.abs(value - rightElementLeft) <= 2) {
          leftSnapPosition = value - elemenWidth;
          plusWidth = true;
          break;
        }
      }

      return {
        isShow,
        left: isShow ? leftSnapPosition : 0,
        plusWidth,
      };
    },

    handleSnapLeft(isDraggable = true){
      const snapLeftState = this.setSnapLeft(
        this.itemElement.left,
        this.snapWindowLeft
      );
      if (
        (!this.snapStore.isShowSnapLeft && snapLeftState.isShow) ||
        (this.snapStore.isShowSnapLeft && !snapLeftState.isShow)
      ) {
        this.$emit("snap-left", {
          snapLeftState: {
            ...snapLeftState,
            left: snapLeftState.plusWidth
              ? snapLeftState.left + this.itemElement.width
              : snapLeftState.left,
          },
        });
      }
      if (!this.snapStore.isShowSnapLeft && snapLeftState.isShow) {
        if (!isDraggable){
          this.itemElement.left = snapLeftState.left;
        }
        this.snapStore.updateIsShowSnapLeft(true);
      }
      if (this.snapStore.isShowSnapLeft && !snapLeftState.isShow) {
        this.snapStore.updateIsShowSnapLeft(false);
      }
      if (snapLeftState.isShow && isDraggable) {
        this.itemElement.left = snapLeftState.left;
      }
    },

    snapTopElement(item: ElementLadi, arrElement: ElementLadi[], arrSection: number[]){
      const elemenHeight = item.height;
      const bottomElementTop = item.top + elemenHeight;
      const isShowElement = arrElement.some(
        (ele) =>
          Math.abs(ele.top - item.top) <= 2 || Math.abs(ele.top - bottomElementTop) <= 2 || Math.abs(ele.top + ele.height - item.top) <= 2 || Math.abs(ele.top + ele.height - bottomElementTop) <=2
      );
      const isShowSection = arrSection.some(
        (value) =>
          Math.abs(value - item.top) <= 2 || Math.abs(value - bottomElementTop) <= 2
      );

      if (isShowElement || isShowSection){
        if (!this.snapStore.isShowSnapTop) {
          this.snapStore.updateIsShowSnapTop(true);
        }
        if (isShowElement){
          for (const ele of arrElement) {
            if (Math.abs(ele.top - item.top) <= 2 || Math.abs(ele.top - bottomElementTop) <= 2 || Math.abs(ele.top + ele.height - item.top) <= 2 || Math.abs(ele.top + ele.height - bottomElementTop) <= 2) {
              // snap width
              if (((item.left + item.width) < ele.left || (ele.left + ele.width) < item.left)) {
                if (!this.snapStore.snapWidth.isShow) {
                  this.snapStore.snapWidth.isShow = true;
                }
                if ((item.left + item.width) < ele.left) {
                  this.snapStore.snapWidth.left = (item.left + item.width);
                  this.snapStore.snapWidth.right = ele.left;
                }
                if ((ele.left + ele.width) < item.left) {
                  this.snapStore.snapWidth.left = (ele.left + ele.width);
                  this.snapStore.snapWidth.right = item.left;
                }
              }
              if (((item.left <= ele.left && ele.left <= item.width + item.left) || (ele.left <= item.left && item.left <= ele.width + ele.left)) && this.snapStore.snapWidth.isShow) {
                this.snapStore.snapWidth.isShow = false;
              }
              // snap top
              if (Math.abs(item.top - ele.top) <= 2) {
                this.itemElement.top = ele.top;
                this.$emit("snap-top", {
                  snapTopState: {
                    top: ele.top,
                    isShow: true,
                  },
                });
                break;
              }
              if (Math.abs(ele.top + ele.height - item.top) <= 2) {
                this.itemElement.top = ele.top + ele.height;
                this.$emit("snap-top", {
                  snapTopState: {
                    top: ele.top + ele.height,
                    isShow: true,
                  },
                });
                break;
              }
              if (Math.abs(ele.top - bottomElementTop) <= 2) {
                this.itemElement.top = ele.top - elemenHeight;
                this.$emit("snap-top", {
                  snapTopState: {
                    top: ele.top,
                    isShow: true,
                  },
                });
                break;
              }
              if (Math.abs(ele.top + ele.height - bottomElementTop) <= 2) {
                this.itemElement.top = ele.top + ele.height - elemenHeight;
                this.$emit("snap-top", {
                  snapTopState: {
                    top: ele.top + ele.height,
                    isShow: true,
                  },
                });
                break;
              }
            }
          }
        }

        if(isShowSection){

        }
      }

      if (!isShowElement && !isShowSection){
        if (this.snapStore.isShowSnapTop) {
          this.snapStore.updateIsShowSnapTop(false);
        }
        if(this.snapStore.snapWidth.isShow){
          this.snapStore.snapWidth.isShow = false;
        }
      }

      // return {
      //   isShow,
      //   top: isShow ? leftSnapPosition : 0,
      //   plusHeight,
      // };
    },

    setSnapTop(top: number, arr: number[]): ISnapTopState {
      const elemenHeight = this.itemElement.height;
      const bottomElementTop = top + elemenHeight;
      const isShow = arr.some(
        (value) =>
          Math.abs(value - top) <= 2 || Math.abs(value - bottomElementTop) <= 2
      );

      let leftSnapPosition = 0;
      let plusHeight = false;
      if(isShow){
        for (const value of arr) {
          if (Math.abs(value - top) <= 2) {
            leftSnapPosition = value;
            plusHeight = false;
            break;
          }
          if (Math.abs(value - bottomElementTop) <= 2) {
            leftSnapPosition = value - elemenHeight;
            plusHeight = true;
            break;
          }
        }
      }

      return {
        isShow,
        top: isShow ? leftSnapPosition : 0,
        plusHeight,
        left: 0
      };
    },

    handleSnapTop(){
      const snapTopState = this.setSnapTop(
        this.itemElement.top + this.preHeight,
        this.builderStore.snapSectionNumber
      );
      if (
        (!this.snapStore.isShowSnapTop && snapTopState.isShow) ||
        (this.snapStore.isShowSnapTop && !snapTopState.isShow)
      ) {
        this.$emit("snap-top", {
          snapTopState: {
            ...snapTopState,
            top: snapTopState.plusHeight
              ? snapTopState.top + this.itemElement.height
              : snapTopState.top,
          },
        });
      }
      if (!this.snapStore.isShowSnapTop && snapTopState.isShow) {
        this.snapStore.updateIsShowSnapTop(true);
      }
      if (this.snapStore.isShowSnapTop && !snapTopState.isShow) {
        this.snapStore.updateIsShowSnapTop(false);
      }
      if (snapTopState.isShow) {
        // console.log(snapTopState);
        this.itemElement.top = snapTopState.top - this.preHeight;
      }
    }
  },
  props: ["indexSection", "itemElement", "indexElement", "preHeight"],
  emits: ["snap-left", "snap-top"],
});
</script>
