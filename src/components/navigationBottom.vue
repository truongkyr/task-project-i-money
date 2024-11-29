<template>
  <div class="content-wrapper pb-18">
  </div>
  <footer id="footer" class="fixed bottom-0 w-full bg-gray-100 pt-4 p-b-safe-4 2xl:w-1/2 mx-auto">
    <div class="container mx-auto px-8 h-full">
      <ul class="flex justify-between h-full items-center">
        <li v-for="navItem in navItems" :key="navItem.name">
          <router-link :to="{ name: navItem.name, params: {} }">
            <i class="fa-regular text-2xl" :class="navItem.icon"></i>
          </router-link>
        </li>
      </ul>
    </div>

    <div
      data-circle
      class="absolute top-0 left-1/2 transform -translate-x-1/2"
    ></div>
    <div
      data-cricle-inset
      class="absolute flex items-center justify-center bg-primary text-white text-2xl w-12 h-12 rounded-full cursor-pointer -top-6 left-1/2 transform -translate-x-1/2"
      @click="goToRoute"
    >
      <i class="fa-solid fa-plus"></i>
    </div>
  </footer>
</template>


<script>
import { reactive } from "vue";
import { NAV_BOTTOM_ITEMS } from "@/constants";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const navItems = reactive(NAV_BOTTOM_ITEMS);

    function goToRoute() {
      router.push({name: "NewTransaction", params:{} });
    }

    return { navItems, goToRoute };
  },
};
</script>



<style scoped>

footer#footer > div[data-circle] {
  @apply bg-dark-light;
  width: 60px;
  height: 30px;
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
}
footer#footer ul li:nth-child(2) {
  margin-right: 10%;
}
footer#footer ul li:nth-child(3) {
  margin-left: 10%;
}
</style>
