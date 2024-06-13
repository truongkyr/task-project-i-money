<template>
  <div class="mt-6">
    <div class="container mx-auto px-8">
      <!-- Start: Form -->
      <form
        class="flex flex-col justify-start space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="row">
          <label class="flex flex-col" for="email">
            <span class="font-semibold"
              >Email<span class="text-red">*</span></span
            >
            <input
              id="email"
              class="px-4 py-3 rounded-lg border-2 border-gray-100 mt-1"
              type="text"
              placeholder="Email@gmail.com..."
              autocomplete="username"
              v-model="email"
            />
          </label>
        </div>
        <div class="row">
          <label class="flex flex-col" for="password">
            <span class="font-semibold"
              >Mật khẩu<span class="text-red">*</span></span
            >
            <input
              id="password"
              class="px-4 py-3 rounded-lg border-2 border-gray-100 mt-1"
              type="password"
              placeholder="Mật khẩu..."
              autocomplete="current-password"
              v-model="password"
            />
          </label>
        </div>
        <div class="row">
          <button
            v-if="!isPending"
            class="py-3 text-center w-full bg-primary text-white font-bold rounded-lg"
            type="submit"
          >
            Đăng nhập
          </button>
          <button
            v-else
            class="py-3 text-center w-full bg-gray-800 text-white font-bold rounded-lg cursor-not-allowed"
            type="button"
            disabled
          >
            Loading...
          </button>
        </div>
      </form>
      <!-- End: Form -->

      <!-- Start: Error -->
      <div v-if="error" class="text-center text-red mt-4">
        <span>Email hoặc mật khẩu đã sai, vui lòng kiểm tra lại!.</span>
      </div>

      <!-- Start: Direction -->
      <div class="w-full text-center mt-6">
        <span class="font-semibold">Tôi là người dùng mới.</span>
        <span class="ml-1">
          <router-link
            :to="{ name: 'Register', params: {} }"
            class="text-primary font-bold"
            >Đăng ký</router-link
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useSignIn } from "@/composables/useSignIn";
import { auth, db, storage } from "@/configs/firebase";
import router from "@/router";

// import {currentUser} from "../combosables/useAuth"

export default {
  setup() {

    const { error, isPending, signin } = useSignIn();

    const email = ref("");
    const password = ref("");

    async function onSubmit() {
      await signin(email.value, password.value);
      if (!error.value) {
          router.push({ name: 'Profile', params: {} });
      }
    }

    return {
      email,
      password,
      error,
      isPending,
      auth,
      db,
      storage,
      onSubmit,
    };
  },
};
</script>
