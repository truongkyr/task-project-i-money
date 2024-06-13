<template>
  <!-- Start Infomation -->
  <div class="row" v-if="user">
    <div class="container mx-auto p-8">
      <div class="text-center">
        <div class="w-24 h-24 rounded-full overflow-hidden mx-auto">
          <img
            src="@/assets/images/avatar-1.png"
            class="w-full h-auto object-cover"
            alt="User Avatar"
          />
        </div>
        <div class="font-bold text-2xl text-primary mt-3">{{ user.displayName }}</div>
        <p class="font-semibold text-gray-400 mt-1">{{ user.email }}</p>
      </div>
    </div>
  </div>

  <!-- Start Menu -->
  <div class="row">
    <div class="container mx-auto px-8">
      <div class="grid grid-cols-1">
        <div class="col-span-1">
          <h3 class="font-bold text-xl text-primary mb-2">Tổng quan</h3>
        </div>
      </div>
      <div class="grid grid-cols-1">
        <div class="col-span-1">
          <ul>
            <li
              class="text-dark last:text-red"
              v-for="profileOption in profileOptions"
              :key="profileOption.name"
            >
              <router-link
                :to="profileOption.route"
                class="flex justify-between items-center py-3"
              >
                <div class="flex items-center text-left">
                  <i class="fa-solid text-2xl rounded-full overflow-hidden" :class="profileOption.icon"></i>
                  <h5 class="font-semibold ml-3">{{ profileOption.name }}</h5>
                </div>
                <div class="text-right">
                  <i class="fa-solid fa-arrow-right"></i>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { PROFILE_OPTIONS } from '@/constants';
import { useUser } from "@/composables/useUser";
export default {
  setup() {
    const profileOptions = reactive(PROFILE_OPTIONS);

    const { user } = useUser();

    return { profileOptions, user };
  },
};
</script>