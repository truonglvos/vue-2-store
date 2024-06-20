<template>
    <div @click.stop="$emit('on-add-section')" class="ladi-button-add-section ladi-font-default">
        Thêm mới Section
    </div>
    <div ref="moveHandle" @mousedown="handleMouseDown" class="ladi-resize-display">
        <i class="ladi-icon icon-cross-vertical ladi-resize-display-icon"></i>
    </div>
</template>
<script lang="ts">
import type { ISection } from '../models/section.model';
import { defineComponent } from 'vue'
import { useBuildStore } from '../stores/builder';
import { useResizeStore } from '../stores/resize';
import { useSnapStore } from '../stores/snap';

export default defineComponent({
    emits: ["on-add-section"],
    props: ["indexSection", "idSection", "preHeight"],
    setup() {
        const resizeStore = useResizeStore();
        const builderStore = useBuildStore();
        const snapStore = useSnapStore()
        return {
            resizeStore,
            updateSectionHeight: builderStore.updateSectionHeight,
            sectionArray: builderStore.getSectionArray,
            getHeightSection: builderStore.getHeightSection,
            snapStore
        };
    },
    methods: {
        handleMouseMove(mouseMoveEvent: MouseEvent) {
            let deltaY = mouseMoveEvent.clientY - this.resizeStore.initialY;
            const newHeight = this.sectionArray[this.indexSection].height += deltaY;
            const maxBottomToTop = ((this.sectionArray[this.indexSection] as ISection).maxBottomToTop?.value as number);
            if (newHeight < maxBottomToTop) {
                this.updateSectionHeight(this.indexSection, maxBottomToTop);
            } else {
                this.updateSectionHeight(this.indexSection, newHeight);
            }
            this.resizeStore.updateState({
                initialY: mouseMoveEvent.clientY
            });
            if (this.snapStore.isShowSnapLeft || this.snapStore.isShowSnapTop){
                this.snapStore.hideSnap();
            }
        },
        handleMouseUp() {
            document.removeEventListener("mousemove", this.handleMouseMove);
            document.removeEventListener("mouseup", this.handleMouseUp);
        },
        handleMouseDown(mouseEvent: MouseEvent) {
            this.resizeStore.updateState({
                initialY: mouseEvent.clientY,
            });
            document.addEventListener("mousemove", this.handleMouseMove),
            document.addEventListener("mouseup", this.handleMouseUp)
        }
    }
})
</script>
