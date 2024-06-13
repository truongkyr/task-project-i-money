<template>
  <form @submit.prevent="onSubmit">
    <!-- Start: Main From -->
    <div class="row mt-8">
      <div class="bg-white rounded-lg py-4">
        <div class="container mx-auto px-8">
          <div class="row">
            <label for="total" class="flex items-end">
              <div class="w-10 text-right leading-10 mr-4 pb-1">
                <span
                  class="inline-block px-1 text-dark border border-dark rounded text-sm font-bold"
                  >VNĐ</span
                >
              </div>
              <div class="flex flex-col border-b border-gray-100 pb-1">
                <span class="font-semibold text-xs text-dark">Tổng</span>
                <input
                  id="total"
                  class="text-3xl text-dark w-full outline-none mt-1"
                  type="text"
                  placeholder="0$"
                  v-model="total"
                />
                <span class="text-xl text-dark">
                  {{ formattedTotal }}
                </span>
              </div>
            </label>
            <div v-if="!isNumeric(total)" class="row mt-2 text-red">
              Vui lòng nhập số tiền !
            </div>
          </div>
          <div class="row">
            <label for="category" class="flex items-center">
              <div
                class="flex items-center flex-none w-10 text-right leading-10 mr-4"
              >
                <span
                  class="inline-block ml-auto w-8 h-8 rounded-full bg-orange-400"
                ></span>
              </div>
              <div class="flex-1 border-b border-gray-100 py-3">
                <select
                  class="text-dark w-full outline-none font-semibold text-xl"
                  v-model="category"
                >
                  <option value="Chọn" disabled selected>Chọn</option>
                  <option value="Ăn uống">Ăn uống</option>
                  <option value="Quần áo">Quần áo</option>
                  <option value="Hoa quả">Hoa quả</option>
                  <option value="Mua sắm">Mua sắm</option>
                  <option value="Giao thông">Giao thông</option>
                  <option value="Nhà ở">Nhà ở</option>
                  <option value="Du lịch">Du lịch</option>
                  <option value="Đồ uống có cồn">Đồ uống có cồn</option>
                  <option value="Điện nước">Điện nước</option>
                  <option value="Quà cáp">Quà cáp</option>
                  <option value="Học phí">Học phí</option>
                  <option value="Đồ ăn vặt">Đồ ăn vặt</option>
                  <option value="Tiền điện thoại">Tiền điện thoại</option>
                  <option value="Trẻ em">Trẻ em</option>
                  <option value="Thuế">Thuế</option>
                  <option value="Thể thao">Thể thao</option>
                  <option value="Sức khỏe">Sức khỏe</option>
                  <option value="Giải trí">Giải trí</option>
                  <option value="Xã hội">Xã hội</option>
                  <option value="Bảo hiểm">Bảo hiểm</option>
                  <option value="Thú cưng">Thú cưng</option>
                  <option value="Làm đẹp">Làm đẹp</option>
                </select>
              </div>
            </label>
          </div>
          <div class="row">
            <label for="note" class="flex items-center">
              <div
                class="flex items-center flex-none w-10 text-right leading-10 mr-4"
              >
                <span class="flex-none w-10 mr-4">
                  <i class="fa-regular fa-file-lines text-2xl"></i>
                </span>
              </div>
              <div class="flex-1 border-b border-gray-100 py-3">
                <input
                  id="note"
                  class="text-dark w-full outline-none"
                  type="text"
                  placeholder="Ghi chú"
                  v-model="note"
                />
              </div>
            </label>
          </div>
          <div class="row">
            <label for="time" class="flex items-center">
              <div class="flex-none w-10 mr-4">
                <span class="flex items-center justify-end text-dark">
                  <i class="fa-solid fa-calendar-days text-2xl"></i>
                </span>
              </div>
              <div class="flex-1 py-2 border-b border-gray-100">
                <input type="date" class="text-dark w-full" v-model="time" />
              </div>
            </label>
          </div>
          <div class="row">
            <label for="wallet" class="flex items-center">
              <div class="flex-none w-10 mr-4">
                <span class="flex items-center justify-end text-dark">
                  <i class="fa-solid fa-wallet text-2xl"></i>
                </span>
              </div>
              <router-link :to="{ name: 'home', params: {} }">
                <div class="flex-1 py-2">
                  <div class="text-dark w-full">Ví của tôi</div>
                </div>
              </router-link>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-8" v-if="!isMoreDetails">
      <button
        @click="isMoreDetails = true"
        class="bg-white rounded-lg py-3 w-full text-primary font-semibold"
      >
        Thêm
      </button>
    </div>

    <template v-if="isMoreDetails">
      <!-- Start: Advanced Form -->
      <div class="row mt-8">
        <div class="bg-white rounded-lg py-4">
          <div class="container mx-auto px-8">
            <div class="row">
              <label for="location" class="flex items-center">
                <div
                  class="flex items-center flex-none w-10 text-right leading-10 mr-4"
                >
                  <span class="flex-none w-10 mr-4">
                    <i class="fa-solid fa-location-dot text-2xl"></i>
                  </span>
                </div>
                <div class="flex-1 border-b border-gray-100 pb-1">
                  <input
                    id="location"
                    class="text-xl text-dark w-full outline-none mt-1"
                    type="text"
                    placeholder="Vị trí"
                    v-model="location"
                  />
                </div>
              </label>
            </div>
            <div class="row">
              <label for="withPerson" class="flex items-center">
                <div
                  class="flex items-center flex-none w-10 text-right leading-10 mr-4"
                >
                  <span class="flex-none w-10 mr-4">
                    <i class="fa-solid fa-users text-2xl"></i>
                  </span>
                </div>
                <div class="flex-1 border-b border-gray-100 pb-1">
                  <input
                    id="withPerson"
                    class="text-xl text-dark w-full outline-none mt-1"
                    type="text"
                    placeholder="Với người"
                    v-model="person"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- Upload images -->
      <div class="row mt-8">
        <div class="bg-white rounded-lg py-4">
          <div class="container mx-auto px-8">
            <div class="row">
              <label for="uploadImages" class="flex items-center text-primary">
                <div
                  class="flex items-center flex-none w-10 text-right leading-10 mr-4"
                >
                  <span class="flex-none w-10 mr-4">
                    <i class="fa-solid fa-camera text-2xl"></i>
                  </span>
                </div>
                <div class="flex-1 border-b border-gray-100 pb-1">
                  <div class="w-full font-semibold">Đăng tải hình ảnh</div>
                  <input
                    type="file"
                    id="uploadImages"
                    class="w-0 h-0 overflow-hidden absolute"
                    @change="onChangeFile"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="text-red text-center py-3">{{ errorFile }}</div>
      </div>
    </template>
    <div class="row mt-4 text-center">
      <button
        type="submit"
        class="bg-primary text-white items-center rounded-full w-80 h-12"
      >
        Lưu
      </button>
    </div>
    <!-- Start: Back -->
    <div class="row mt-8">
      <div class="flex items-center flex-none w-10 text-right leading-10 mr-4">
        <router-link class="flex" :to="{ name: 'home', params: {} }">
          <span class="flex-none w-10 mr-2">
            <i class="fa-solid fa-arrow-left text-2xl text-gray-500"></i>
          </span>
          <span class="text-gray-500 inline-block text-2xl" style="width: 66px"
            >Trở về</span
          >
        </router-link>
      </div>
    </div>

    <!-- Start: Exchange -->
    <div class="row mt-8">
      <div
        class="flex items-center w-full leading-10 text-center place-content-center"
      >
        <router-link class="flex" :to="{ name: 'NewIncome', params: {} }">
          <i class="fa-solid fa-rotate text-3xl text-primary"></i>
        </router-link>
      </div>
    </div>

    <!-- Modal: Confirm -->
    <div
      v-if="confirmVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Mục đã được lưu</h2>
        <p>Mục chi tiêu của bạn đã được lưu !</p>
        <div class="flex justify-end mt-4">
          <button
            @click="onConfirmClick"
            class="px-4 py-2 bg-green-500 text-primary rounded hover:bg-green-600 mr-2"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { ref, watch } from "vue";
import { useUser } from "@/composables/useUser";
import useCollection from "@/composables/useCollection";
import useStorage from "@/composables/useStorage";

export default {
  setup() {
    const confirmVisible = ref(false);

    const isMoreDetails = ref(false);

    const { error, addRecord } = useCollection("transactions");

    const { uploadFile, url } = useStorage("transactions");

    const total = ref(0);
    const formattedTotal = ref("");

    const category = ref("Chọn");
    const note = ref("");
    const time = ref(new Date().toISOString().substr(0, 10));
    const location = ref("");
    const person = ref("");

    const file = ref(null);
    const errorFile = ref(null);

    const { user } = useUser();

    function onChangeFile(event) {
      const selected = event.target.files[0];
      const typesFile = ["image/png", "image/jpg"];
      if (selected && typesFile.includes(selected.type)) {
        file.value = selected;
      } else {
        file.value = null;
        errorFile.value = "Vui lòng chọn một tệp png hoặc jpg.";
      }
    }
    async function onSubmit() {
      if (isNaN(total.value)) {
        error.value = "Vui lòng nhập một số hợp lệ.";
        return;
      }

      if (file.value) await uploadFile(file.value);

      const transaction = {
        total: parseInt(total.value),
        category: category.value,
        note: note.value,
        time: time.value,
        location: location.value,
        person: person.value,
        userID: user.value.uid,
        thumbnail: url.value,
      };

      await addRecord(transaction);

      confirmVisible.value = true; // Hiển thị modal xác nhận
      error.value = null; // Xóa thông báo lỗi nếu có
    }

    function isNumeric(value) {
      return /^\d+$/.test(value);
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    }

    function resetForm() {
      total.value = 0;
      category.value = "Chọn";
      note.value = "";
      time.value = new Date().toISOString().substring(0, 10);
      location.value = "";
      person.value = "";
      file.value = null;
      errorFile.value = null;
      confirmVisible.value = false;
    }

     function onConfirmClick() {
      resetForm();
    }

    watch(total, (newValue) => {
      formattedTotal.value = formatCurrency(newValue);
    });

    return {
      isMoreDetails,
      total,
      category,
      note,
      time,
      location,
      person,
      errorFile,
      formattedTotal,
      confirmVisible,
      resetForm,
      onConfirmClick,
      isNumeric,
      formatCurrency,
      onChangeFile,
      onSubmit,
    };
  },
};
</script>
