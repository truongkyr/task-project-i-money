import { reactive } from "vue";

export const EventBus = reactive({
  event: null,
  emit(eventName) {
    this.event = eventName;
  },
});