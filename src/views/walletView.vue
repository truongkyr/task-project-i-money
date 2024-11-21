<template>
  <div class="container mx-auto px-4">
    <!-- Chọn năm -->
    <div class="mb-4">
      <label for="yearSelect" class="block text-gray-700 font-semibold">
        Chọn năm:
      </label>
      <select
        id="yearSelect"
        v-model="selectedYear"
        class="border border-gray-400 px-4 py-2 rounded-lg w-full"
      >
        <option value="tất cả">Tất cả</option>
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <!-- Header -->
    <div class="bg-green p-4 rounded-lg text-white">
      <h1 class="text-2xl font-bold">
        Kế hoạch tiết kiệm năm {{ selectedYear }}
      </h1>
    </div>

    <!-- Tóm tắt kế hoạch tiết kiệm -->
    <div class="bg-green-100 p-6 rounded-lg shadow-md my-4">
      <h2 class="text-2xl font-bold text-green-700 mb-4">
        Tổng quan tiết kiệm năm {{ selectedYear }}
      </h2>
      <div class="flex items-center space-x-6">
        <!-- Biểu đồ tròn (Placeholder) -->
        <div class="w-1/3">
          <div class="relative">
            <div
              class="w-24 h-24 rounded-full bg-primary mx-auto flex items-center justify-center"
            >
              <span class="text-lg font-semibold text-white"
                >{{ savingProgress }}%</span
              >
            </div>
          </div>
        </div>
        <!-- Mục tiêu tiết kiệm -->
        <div class="w-2/3">
          <div class="my-2">
            <label for="savingGoalInput" class="text-gray-700 font-semibold"
              ><strong>Mục tiêu:</strong></label
            >
            <input
              id="savingGoalInput"
              type="text"
              v-model="savingGoalInput"
              class="border border-gray-400 p-2 rounded-lg w-1/2 mx-2"
              @input="onGoalInput"
              @blur="onGoalBlur"
              placeholder="Nhập mục tiêu tiết kiệm"
            />
            VNĐ
          </div>
          <p class="text-gray-700 my-2">
            <strong>Đã tiết kiệm:</strong> {{ formatCurrency(savings) }}
          </p>
          <p class="text-gray-700 my-2">
            <strong>Còn lại:</strong> {{ formatCurrency(remainingGoal) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Số tiết kiệm -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-primary font-bold text-xl">
        Số tiết kiệm: {{ formatCurrency(savings) }}
      </p>
    </div>

    <!-- Form thêm mục tiêu tiết kiệm -->
    <div class="bg-white p-6 rounded-lg shadow-md my-4">
      <h2 class="text-xl font-semibold mb-4">Thêm mục tiêu tiết kiệm</h2>
      <div class="flex space-x-4">
        <input
          v-model="newGoal.name"
          type="text"
          class="border border-gray-400 p-2 rounded-lg w-1/2"
          placeholder="Tên mục tiêu"
        />
        <input
          v-model="newGoal.savings"
          type="number"
          class="border border-gray-400 p-2 rounded-lg w-1/4"
          placeholder="Đã tiết kiệm"
        />
        <input
          v-model="newGoal.progress"
          type="number"
          class="border border-gray-400 p-2 rounded-lg w-1/4"
          placeholder="Tiến độ (%)"
        />
        <input
          v-model="newGoal.deadline"
          type="text"
          class="border border-gray-400 p-2 rounded-lg w-1/4"
          placeholder="Thời hạn"
        />
      </div>
      <button
        @click="addSavingGoal"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Thêm mục tiêu
      </button>
    </div>

    <!-- Danh sách các khoản tiết kiệm -->
    <div class="my-6 bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Danh sách các khoản tiết kiệm</h2>
      <table class="w-full text-center border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Tên mục tiêu</th>
            <th class="border border-gray-300 px-4 py-2">Đã tiết kiệm</th>
            <th class="border border-gray-300 px-4 py-2">Tiến độ</th>
            <th class="border border-gray-300 px-4 py-2">Thời hạn</th>
            <th class="border border-gray-300 px-4 py-2">Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(goal, index) in savingGoals" :key="index">
            <td class="border border-gray-300 px-4 py-2">{{ goal.name }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ formatCurrency(goal.savings) }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ goal.progress }}%
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ goal.deadline }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button
                @click="removeSavingGoal(index)"
                class="px-2 py-1 bg-red-500 text-dark rounded-lg"
              >
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-6 bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Dự báo</h2>
      <div class="my-2">
        <label for="savingRateInput" class="block text-gray-700 font-semibold">
          Nhập tỷ lệ tiết kiệm mỗi tháng (VNĐ):
        </label>
        <input
          id="savingRateInput"
          type="text"
          v-model="formattedSavingRate"
          class="border border-gray-400 px-4 py-2 rounded-lg w-1/2"
          placeholder="Nhập số tiền tiết kiệm mỗi tháng"
          @input="updateSavingRate"
        />
        VNĐ
      </div>
      <!-- Kết quả dự báo -->
      <p class="text-gray-700 mt-4">
        Nếu tiết kiệm
        <strong>{{ formatCurrency(savingRate) }} VNĐ/tháng</strong>, bạn sẽ hoàn
        thành mục tiêu trong:
        <strong>{{ estimatedCompletion }}</strong>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { db } from "@/configs/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  setup() {
    const selectedYear = ref(new Date().getFullYear().toString());
    const transactions = ref([]);
    const income = ref([]);
    const availableYears = ref([]);
    const savingGoals = ref([]);
    const savingGoalInput = ref(localStorage.getItem("savingGoalInput") || ""); // Lưu trạng thái mục tiêu tiết kiệm
    const savingRate = ref(parseFloat(localStorage.getItem("savingRate") || 0));
    const formattedSavingRate = ref(""); // Giá trị định dạng để hiển thị trong input

    const newGoal = ref({
      name: "",
      savings: 0,
      progress: 0,
      deadline: "",
    });

    const formatNumber = (value) => {
      if (!value) return "";
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const updateSavingRate = (event) => {
      const rawValue = event.target.value.replace(/\./g, ""); // Xóa dấu chấm
      savingRate.value = parseFloat(rawValue) || 0; // Cập nhật giá trị thực
      formattedSavingRate.value = formatNumber(rawValue); // Cập nhật giá trị hiển thị
    };

    // Lưu savingGoalInput và savingRate vào localStorage khi thay đổi
    watch(savingGoalInput, (newValue) => {
      localStorage.setItem("savingGoalInput", newValue);
    });

    watch(savingRate, (newValue) => {
      localStorage.setItem("savingRate", newValue);
    });

    const loadSavingGoalsFromLocalStorage = () => {
      const savedGoals = localStorage.getItem("savingGoals");
      if (savedGoals) {
        savingGoals.value = JSON.parse(savedGoals);
      }
    };

    const saveSavingGoalsToLocalStorage = () => {
      localStorage.setItem("savingGoals", JSON.stringify(savingGoals.value));
    };

    const removeSavingGoal = (index) => {
      savingGoals.value.splice(index, 1);
      saveSavingGoalsToLocalStorage();
    };

    const fetchData = async () => {
      const transactionCollection = collection(db, "transactions");
      const incomeCollection = collection(db, "income");

      const transactionSnapshot = await getDocs(transactionCollection);
      const incomeSnapshot = await getDocs(incomeCollection);

      transactions.value = transactionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "Chi tiêu",
        time: doc.data().time || "",
      }));

      income.value = incomeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "Thu nhập",
        time: doc.data().time || "",
      }));

      setAvailableYears();
    };

    const setAvailableYears = () => {
      const years = new Set();
      [...transactions.value, ...income.value].forEach((item) => {
        const year = getYearFromTime(item.time);
        if (year) years.add(year);
      });
      availableYears.value = Array.from(years).sort().reverse();
    };

    const getYearFromTime = (time) => {
      if (!time) return "";
      const date = new Date(time);
      return isNaN(date.getTime()) ? "" : date.getFullYear().toString();
    };

    const totalIncome = computed(() => {
      return income.value.reduce((sum, i) => {
        if (
          selectedYear.value === "tất cả" ||
          getYearFromTime(i.time) === selectedYear.value
        ) {
          return sum + parseFloat(i.total || 0);
        }
        return sum;
      }, 0);
    });

    const totalExpenses = computed(() => {
      return transactions.value.reduce((sum, t) => {
        if (
          selectedYear.value === "tất cả" ||
          getYearFromTime(t.time) === selectedYear.value
        ) {
          return sum + parseFloat(t.total || 0);
        }
        return sum;
      }, 0);
    });

    const savings = computed(() => {
      return totalIncome.value - totalExpenses.value;
    });

    const savingProgress = computed(() => {
      const goal = parseFloat(savingGoalInput.value.replace(/\./g, ""));
      if (!goal) return 0;
      return selectedYear.value === "tất cả"
        ? ((savings.value / goal) * 100).toFixed(2)
        : ((savings.value / goal) * 100).toFixed(2);
    });

    const remainingGoal = computed(() => {
      const goal = parseFloat(savingGoalInput.value.replace(/\./g, ""));
      return goal - savings.value || 0;
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    const addSavingGoal = () => {
      if (
        !newGoal.value.name ||
        !newGoal.value.savings ||
        !newGoal.value.deadline
      ) {
        console.log("Lỗi");
        return;
      }
      savingGoals.value.push({ ...newGoal.value });
      newGoal.value = { name: "", savings: 0, progress: 0, deadline: "" };

      saveSavingGoalsToLocalStorage();
    };

    onMounted(() => {
      loadSavingGoalsFromLocalStorage();
      fetchData();
    });

    const estimatedCompletion = computed(() => {
      const remainingAmount = remainingGoal.value; // Lấy số tiền còn lại
      const monthlyRate = savingRate.value; // Lấy tỷ lệ tiết kiệm mỗi tháng

      // Kiểm tra nếu đã hoàn thành
      if (remainingAmount <= 0) {
        return "Đã hoàn thành mục tiêu!";
      }

      // Kiểm tra nếu tỷ lệ tiết kiệm bằng 0
      if (monthlyRate <= 0) {
        return "Vui lòng nhập tỷ lệ tiết kiệm mỗi tháng.";
      }

      // Tính số tháng cần để hoàn thành
      const monthsNeeded = Math.ceil(remainingAmount / monthlyRate);
      const completionDate = new Date();
      completionDate.setMonth(completionDate.getMonth() + monthsNeeded);

      return `${monthsNeeded} tháng (dự kiến hoàn thành vào ${completionDate.toLocaleDateString(
        "vi-VN",
        {
          month: "long",
          year: "numeric",
        }
      )})`;
    });

    return {
      selectedYear,
      availableYears,
      totalIncome,
      totalExpenses,
      savings,
      savingGoals,
      formatCurrency,
      savingGoalInput,
      savingProgress,
      remainingGoal,
      estimatedCompletion,
      newGoal,
      addSavingGoal,
      removeSavingGoal,
      updateSavingRate,
      savingRate,
    };
  },
};
</script>
