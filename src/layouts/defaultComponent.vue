<template>
<navigation-header/>
  <slot />
  <navigation-bottom v-if="meta.isShowFooter"/>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import navigationBottom from '@/components/navigationBottom.vue';
import navigationHeader from '@/components/navigationHeader.vue'

export default {
  components: { navigationBottom, navigationHeader },
  setup() {
    const route = useRoute();
    return{
      meta: computed(() => route.meta),
    }
  }
};
</script>
