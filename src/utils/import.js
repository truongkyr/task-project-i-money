import { defineAsyncComponent } from "vue";

export function registerGlobalComponents(app) {
  app.component(
    "auth-layout",
    defineAsyncComponent(() => import("@/layouts/authComponent"))
  );
  app.component(
    "default-layout",
    defineAsyncComponent(() => import("@/layouts/defaultComponent"))
  );
}
