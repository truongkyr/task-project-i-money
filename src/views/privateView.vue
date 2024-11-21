<template>
  <div class="row py-3">
    <div class="container mx-auto px-4">
      <div class="row py-3">
        <span class="font-bold text-xl uppercase text-gray-600"
          >chỉnh sửa quyền riêng tư của bạn</span
        >
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <span class="text-primary flex items-center">
            <i class="fa-solid fa-phone text-4xl"></i>
            <span class="text-primary px-4 font-bold text-xl uppercase"
              >Cuộc gọi</span
            >
          </span>
          <input type="checkbox" value="" class="sr-only peer" checked />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          ></div>
        </label>
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <span class="text-yellow-300 flex items-center"
            ><i class="fa-regular fa-envelope text-4xl"></i>
            <span class="text-yellow-300 px-4 font-bold text-xl uppercase"
              >tin nhắn</span
            >
          </span>
          <input type="checkbox" value="" class="sr-only peer" checked />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"
          ></div>
        </label>
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <input type="checkbox" value="" class="sr-only peer" checked />
          <span class=" text-pink-900 flex items-center"
            ><i class="fa-solid fa-user text-4xl"></i>
            <span class=" text-pink-900 px-4 font-bold text-xl uppercase"
              >Danh bạ</span
            >
          </span>
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-pink-900 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-900"
          ></div>
        </label>
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <span class="text-red flex items-center"
            ><i class="fa-solid fa-camera text-4xl"></i>
            <span class="text-red px-4 font-bold text-xl uppercase"
              >Camera</span
            >
          </span>
          <input type="checkbox" value="" class="sr-only peer" checked />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red dark:peer-focus:ring-red dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red"
          ></div>
        </label>
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <span class="text-green flex items-center"
            ><i class="fa-solid fa-microphone text-4xl"></i>
            <span class="text-green px-4 font-bold text-xl uppercase"
              >Ghi âm</span
            >
          </span>
          <input type="checkbox" value="" class="sr-only peer" checked />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green dark:peer-focus:ring-green peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"
          ></div>
        </label>
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <span class="text-violet-400 flex items-center"
            ><i class="fa-solid fa-location-dot text-4xl"></i>
            <span class="text-violet-400 px-4 font-bold text-xl uppercase"
              >Vị trí</span
            >
          </span>
          <input type="checkbox" value="" class="sr-only peer" checked />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-violet-400 dark:peer-focus:ring-violet-400 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-400"
          ></div>
        </label>
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <input type="checkbox" value="" class="sr-only peer" checked />
          <span class="text-teal-300 flex items-center"
            ><i class="fa-solid fa-calendar-days text-4xl"></i>
            <span class="text-teal-300 px-4 font-bold text-xl uppercase"
              >Lịch</span
            >
          </span>
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"
          ></div>
        </label>
      </div>
      <div class="row py-3">
        <label class="flex items-center cursor-pointer justify-between">
          <input type="checkbox" value="" class="sr-only peer" checked />
          <span class="text-orange-300 flex items-center"
            ><i class="fa-regular fa-folder-open text-4xl"></i>
            <span class="text-orange-300 px-4 font-bold text-xl uppercase"
              >File & Media</span
            >
          </span>
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"
          ></div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>