<template>
    <div class="ladi-button">
  <div
    class="ladi-button-background"
    style="
      background-image: linear-gradient(rgb(13, 97, 242), rgb(47, 123, 254));
    "
  ></div>
  <div class="ladi-overlay"></div>
  <div
    id="BUTTON_TEXT2"
    style="width: 160px; top: 9px; left: 0px"
    class="ladi-element"
  >
    <p
      ref="editable"
      class="ladi-headline"
      :style="{
        'line-height': applyCss?.lightHeight,
        'text-align': applyCss?.textAlign,
        'font-weight': applyCss?.fontWeight,
        'color': applyCss?.color,
        'font-size': applyCss?.fontSize + 'px'
      }"
      v-html="itemElement?.innerHtml"
      @dblclick.stop="
        dbClickElement($event.target)
      "
      @click.stop
      @blur="handleBlur"
    ></p>
  </div>
</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    emits: ["on-update-draggable"],
    props: ["height", "itemElement", "applyCss", "indexSection", "indexElement"],
    methods:{
      dbClickElement(target: EventTarget | null){
        this.$emit('on-update-draggable', false);
        (this.$refs.editable as HTMLElement).setAttribute('contenteditable', 'true');
        window?.getSelection()?.selectAllChildren(target as Node);
      },
      handleBlur(){
        this.$emit('on-update-draggable', true);
        (this.$refs.editable as HTMLElement).removeAttribute('contenteditable');
      }
    }
})
</script>