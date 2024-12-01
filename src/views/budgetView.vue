<template>
  <div>
    <!-- Transaction, Income Table -->
    <div class="row">
      <div
        class="py-4 w-48 mb-4 rounded-lg border border-dark ml-1 text-center"
      >
        <input
          type="month"
          class="text-dark"
          v-model="time"
          @input="fetchData"
        />
      </div>
    </div>

    <!-- Biểu đồ Chi tiêu -->
    <div class="row border-t-8 border-b-8 border-x-8">
      <div class="bg-white py-4">
        <div class="container mx-auto px-8">
          <label class="font-semibold" for="chart">
            <div class="leading-10 pb-1 text-dark">
              <span class="text-xl flex justify-center">
                <i class="fa-solid fa-chart-pie"></i>
              </span>
              <span class="px-1 text-xs font-bold flex justify-center pt-2">
                Biểu đồ chi tiêu
              </span>
              <span class="text-center block">{{ formattedTime }}</span>
            </div>
            <div class="py-4">
              <div class="container mx-auto px-8">
                <div class="fonsemibold">
                  <div class="leading-10 pb-1">
                    <Pie
                      v-if="
                        !loading && showExpenseChart && chartData.labels.length
                      "
                      :data="chartData"
                      :options="chartOptions"
                      :key="chartData.labels.join('-')"
                    />
                    <p v-else>Đang tải biểu đồ...</p>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Biểu đồ Thu nhập -->
    <div class="row border-b-8 border-x-8">
      <div class="bg-white py-4">
        <div class="container mx-auto px-8">
          <label class="font-semibold" for="chart">
            <div class="leading-10 pb-1 text-dark">
              <span class="text-xl flex justify-center">
                <i class="fa-solid fa-chart-pie"></i>
              </span>
              <span class="px-1 text-xs font-bold flex justify-center pt-2">
                Biểu đồ Thu nhập
              </span>
              <span class="text-center block">{{ formattedTime }}</span>
            </div>
            <div class="py-4">
              <div class="container mx-auto px-8">
                <div class="fonsemibold">
                  <div class="leading-10 pb-1">
                    <Pie
                      v-if="
                        !loading &&
                        showIncomeChart &&
                        chartDataIncome.labels.length
                      "
                      :data="chartDataIncome"
                      :options="chartOptions"
                      :key="chartDataIncome.labels.join('-')"
                    />
                    <p v-else>Đang tải biểu đồ...</p>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { db } from "@/configs/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: "PieChart",
  components: { Pie },
  setup() {
    const time = ref(new Date().toISOString().slice(0, 7)); // Mặc định là tháng hiện tại
    const loading = ref(false);

    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: "Chi tiêu",
          data: [],
          backgroundColor: [],
        },
      ],
    });

    const chartDataIncome = ref({
      labels: [],
      datasets: [
        {
          label: "Thu nhập",
          data: [],
          backgroundColor: [],
        },
      ],
    });

    const showExpenseChart = ref(false); // Biểu đồ chi tiêu có dữ liệu
    const showIncomeChart = ref(false); // Biểu đồ thu nhập có dữ liệu

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: false, // Tạm thời vô hiệu hóa tiêu đề
        },
      },
    };

    const formattedTime = computed(() => {
      const date = new Date(`${time.value}-01`);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "numeric",
      });
    });

    // Hàm lấy dữ liệu từ Firestore
    const fetchData = () => {
      const auth = getAuth();
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      if (!userId) {
        console.error("Người dùng chưa đăng nhập.");
        return;
      }

      const transactionsRef = collection(db, `users/${userId}/transactions`);
      const incomeRef = collection(db, `users/${userId}/income`);

      onSnapshot(transactionsRef, (snapshot) => {
        const transactions = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const filteredTransactions = transactions.filter((item) => {
          const [year, month] = time.value.split("-").map(Number);

          let date;
          if (item.time instanceof Timestamp) {
            date = item.time.toDate();
          } else if (typeof item.time === "string") {
            date = new Date(item.time);
          } else if (typeof item.time === "number") {
            date = new Date(item.time);
          } else {
            console.error("Trường `time` không hợp lệ:", item.time);
            return false;
          }

          return date.getFullYear() === year && date.getMonth() + 1 === month;
        });

        const groupedTransactions = groupByCategory(filteredTransactions);

        // Cập nhật biểu đồ chi tiêu nếu có dữ liệu
        if (Object.keys(groupedTransactions).length > 0) {
          updateChartData(chartData.value, groupedTransactions);
          showExpenseChart.value = true; // Hiển thị biểu đồ chi tiêu
        } else {
          showExpenseChart.value = false; // Ẩn biểu đồ chi tiêu
        }
      });

      onSnapshot(incomeRef, (snapshot) => {
        const income = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const filteredIncome = income.filter((item) => {
          let date;
          if (item.time instanceof Timestamp) {
            date = item.time.toDate();
          } else if (typeof item.time === "string") {
            date = new Date(item.time);
          } else if (typeof item.time === "number") {
            date = new Date(item.time);
          } else {
            console.error("Trường `time` không hợp lệ:", item.time);
            return false;
          }

          const [year, month] = time.value.split("-").map(Number);
          return date.getFullYear() === year && date.getMonth() + 1 === month;
        });

        const groupedIncome = groupByCategory(filteredIncome);

        // Cập nhật biểu đồ thu nhập nếu có dữ liệu
        if (Object.keys(groupedIncome).length > 0) {
          updateChartData(chartDataIncome.value, groupedIncome);
          showIncomeChart.value = true; // Hiển thị biểu đồ thu nhập
        } else {
          showIncomeChart.value = false; // Ẩn biểu đồ thu nhập
        }
      });
    };

    // Cập nhật dữ liệu biểu đồ
    const updateChartData = (chart, groupedData) => {
      chart.labels = Object.keys(groupedData);
      chart.datasets[0].data = Object.values(groupedData);
      chart.datasets[0].backgroundColor = chart.labels.map(() =>
        getRandomColor()
      );
    };

    // Hàm nhóm theo category
    const groupByCategory = (data) => {
      return data.reduce((acc, item) => {
        if (!item.total || isNaN(item.total)) {
          console.error("Dữ liệu total không hợp lệ:", item);
          return acc;
        }

        const category = item.category || "Không phân loại"; // Sử dụng "Không phân loại" nếu không có category
        acc[category] = (acc[category] || 0) + item.total;
        return acc;
      }, {});
    };

    // Hàm lấy màu ngẫu nhiên cho mỗi category
    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      return `#${Array.from({ length: 6 })
        .map(() => letters[Math.floor(Math.random() * 16)])
        .join("")}`;
    };

    // Khi thời gian (tháng) thay đổi, gọi lại fetchData
    watch(time, fetchData);

    // Khi trang được tải, gọi fetchData lần đầu
    onMounted(() => {
      fetchData();
    });

    return {
      time,
      chartData,
      chartDataIncome,
      chartOptions,
      loading,
      formattedTime,
      showExpenseChart,
      showIncomeChart,
    };
  },
};
</script>

