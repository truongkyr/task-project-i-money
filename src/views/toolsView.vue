<template>
  <div class="container mx-auto px-6 py-4">
    <h1 class="text-2xl font-bold mb-6 text-blue-600">Công cụ quản lý tài chính</h1>

    <!-- Máy tính tài chính -->
    <div class="mb-8 p-6 bg-gray-100 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-green-700">Máy tính tài chính</h2>
      <div class="flex space-x-6">
        <!-- Tính toán khoản vay -->
        <div class="w-1/3">
          <h3 class="font-semibold mb-2">Tính khoản vay</h3>
          <input
            v-model="loanAmount"
            type="number"
            class="border rounded-lg w-full p-2 mb-2"
            placeholder="Số tiền vay (VNĐ)"
          />
          <input
            v-model="interestRate"
            type="number"
            class="border rounded-lg w-full p-2 mb-2"
            placeholder="Lãi suất (%)"
          />
          <input
            v-model="loanDuration"
            type="number"
            class="border rounded-lg w-full p-2 mb-4"
            placeholder="Thời hạn (năm)"
          />
          <button
            @click="calculateLoan"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Tính toán
          </button>
          <p class="mt-4 text-gray-700">
            <strong>Kết quả:</strong> {{ loanResult }}
          </p>
        </div>

        <!-- Dự báo tiết kiệm -->
        <div class="w-1/3">
          <h3 class="font-semibold mb-2">Dự báo tiết kiệm</h3>
          <input
            v-model="savingGoal"
            type="number"
            class="border rounded-lg w-full p-2 mb-2"
            placeholder="Mục tiêu tiết kiệm (VNĐ)"
          />
          <input
            v-model="monthlySaving"
            type="number"
            class="border rounded-lg w-full p-2 mb-4"
            placeholder="Tiết kiệm hàng tháng (VNĐ)"
          />
          <button
            @click="calculateSavingForecast"
            class="bg-green text-gray-700 px-4 py-2 rounded-lg"
          >
            Dự báo
          </button>
          <p class="mt-4 text-gray-700">
            <strong>Thời gian hoàn thành:</strong> {{ savingForecast }}
          </p>
        </div>

        <!-- Tính chi tiêu tối ưu -->
        <div class="w-1/3">
          <h3 class="font-semibold mb-2">Tính chi tiêu tối ưu</h3>
          <input
            v-model="monthlyIncome"
            type="number"
            class="border rounded-lg w-full p-2 mb-4"
            placeholder="Thu nhập hàng tháng (VNĐ)"
          />
          <button
            @click="calculateBudget"
            class="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            Phân bổ ngân sách
          </button>
          <div class="mt-4">
            <p class="text-gray-700">
              <strong>Chi tiêu cần thiết:</strong> {{ budget.necessities }}
            </p>
            <p class="text-gray-700">
              <strong>Mong muốn:</strong> {{ budget.wants }}
            </p>
            <p class="text-gray-700">
              <strong>Tiết kiệm:</strong> {{ budget.savings }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân tích tài chính -->
    <div class="mb-8 p-6 bg-gray-100 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-purple-700">Phân tích tài chính</h2>
      <div>
        <!-- Biểu đồ Placeholder -->
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500">Biểu đồ chi tiêu sẽ được tích hợp tại đây.</p>
        </div>
      </div>
    </div>

    <!-- Gợi ý và nhắc nhở -->
    <div class="p-6 bg-gray-100 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-red-700">Gợi ý & Nhắc nhở</h2>
      <p class="text-gray-700">
        Thiết lập nhắc nhở hóa đơn hoặc mục tiêu tiết kiệm để quản lý tài chính hiệu quả hơn.
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const loanAmount = ref();
    const interestRate = ref();
    const loanDuration = ref();
    const loanResult = ref("");

    const savingGoal = ref();
    const monthlySaving = ref();
    const savingForecast = ref("");

    const monthlyIncome = ref();
    const budget = ref({
      necessities: 0,
      wants: 0,
      savings: 0,
    });

    // Tính toán khoản vay
    const calculateLoan = () => {
      const monthlyRate = interestRate.value / 100 / 12;
      const months = loanDuration.value * 12;
      const result =
        (loanAmount.value * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -months));
      loanResult.value = result
        ? `Khoản thanh toán hàng tháng: ${result.toFixed(2)} VNĐ`
        : "Nhập đầy đủ thông tin!";
    };

    // Dự báo tiết kiệm
    const calculateSavingForecast = () => {
      if (!savingGoal.value || !monthlySaving.value) {
        savingForecast.value = "Nhập đầy đủ thông tin!";
        return;
      }
      const months = Math.ceil(savingGoal.value / monthlySaving.value);
      savingForecast.value = `${months} tháng`;
    };

    // Tính ngân sách
    const calculateBudget = () => {
      const income = monthlyIncome.value;
      budget.value = {
        necessities: (income * 0.5).toFixed(2),
        wants: (income * 0.3).toFixed(2),
        savings: (income * 0.2).toFixed(2),
      };
    };

    return {
      loanAmount,
      interestRate,
      loanDuration,
      loanResult,
      savingGoal,
      monthlySaving,
      savingForecast,
      monthlyIncome,
      budget,
      calculateLoan,
      calculateSavingForecast,
      calculateBudget,
    };
  },
};
</script>
