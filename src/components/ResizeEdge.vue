<template>
    <div @mousedown.stop="handleMouseDown" v-for="(classResize, index) of classResizes" :key="index" data-locked="false" class="ladi-resize"
        :class="classResize">
        <div class="ladi-resize-display"></div>
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    data() {
        return {
            classResizes: ['ladi-s-resize', 'ladi-e-resize'],
        }
    },
    methods: {
        handleMouseDown(){
            
        }
    }
})
</script>