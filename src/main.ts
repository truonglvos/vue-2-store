import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./assets/main.css";

const app = createApp(App);
app.directive("editable", {
  mounted(el, binding, vnode, prevVnode) {
    console.log(el);
  },
});

app.use(createPinia());

app.mount("#app");
