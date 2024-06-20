<template>
  <div class="builder-menu" ref="moveHandle">
    <i @mousedown="handleMouseDown" class="ladi-icon icon-dots builder-menu-move"></i>
    <ul>
      <li v-for="(itemMenu, index) of menuLeft" v-bind:key="index" class="builder-menu-two-column"
        @click.stop="clickItem(index)">
        <div class="builder-menu-click has-builder-menu-child" :class="{
          selected: itemMenu.isSelected,
        }">
          <i class="ladi-icon" :class="itemMenu.icon"></i>
          <span>{{ itemMenu.name }}</span>
        </div>
        <ul class="builder-menu-child" :class="{
          selected: itemMenu.isSelected,
        }">
          <li v-for="(childItem, i) of itemMenu.childMenu" v-bind:key="i"
            @click="$emit('add-element', childItem.elementType)">
            <i class="ladi-icon"></i><span>{{ childItem.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <div class="builder-menu-layer" ng-class="classLayer()">
    <i class="ladi-icon icon-dots builder-menu-move"></i>
    <i ng-click="closeLayer($event)" class="ladi-icon icon-e-remove builder-menu-layer-close"></i>
    <span class="builder-menu-layer-title">Layer</span>
    <div class="builder-menu-layer-filter">
      <input type="text" placeholder="Tìm kiếm..." />
    </div>

    <div class="builder-menu-layer-content"></div>
  </div>
</template>

<script lang="ts">
import { useResizeStore } from "../stores/resize";
import { defineComponent } from "vue";
import { useMenuLeftStore } from "../stores/menu-left";
export default defineComponent({
  setup() {
    const menuLeftStore = useMenuLeftStore();
    const resizeStore = useResizeStore();
    return {
      menuLeft: menuLeftStore.getMenuLeft,
      toggleMenu: menuLeftStore.toggleMenu,
      resizeStore
    };
  },

  methods: {
    clickItem(index: number) {
      this.toggleMenu(index);
    },
    handleMouseMove(mouseMoveEvent: MouseEvent) {
      let currentX = mouseMoveEvent.clientX - this.resizeStore.initialX;
      let currentY = mouseMoveEvent.clientY - this.resizeStore.initialY;
      (this.$refs.moveHandle as HTMLElement).style.top = `${currentY}px`;
      (this.$refs.moveHandle as HTMLElement).style.left = `${currentX}px`;
    },
    handleMouseUp() {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },
    handleMouseDown(mouseEvent: MouseEvent) {
      const clientRect = (this.$refs.moveHandle as HTMLElement).getBoundingClientRect();
      this.resizeStore.currentX = clientRect.left || 0,
      this.resizeStore.currentY = clientRect.top || 0;
      this.resizeStore.initialX = mouseEvent.clientX - this.resizeStore.currentX;
      this.resizeStore.initialY = mouseEvent.clientY - this.resizeStore.currentY;
      document.addEventListener("mousemove", this.handleMouseMove),
      document.addEventListener("mouseup", this.handleMouseUp)
    }
  },

  emits: ["add-element"],
});
</script>

<style lang="scss" scoped>
.builder-menu {
  position: fixed;
  left: 20px;
  top: 15vh;
  width: 70px;
  box-shadow: 0 5px 19px rgba(6, 21, 40, 0.3);
  border-radius: 8px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  background: #fff;
  z-index: 100000000;
}
</style>
