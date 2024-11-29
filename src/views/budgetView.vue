<template>
  <div>
    <!-- Transaction, Income Table -->
    <div class="row">
      <div class="py-4 w-48 mb-4 rounded-lg border border-dark ml-1 text-center">
        <input
          type="month"
          class="text-dark"
          v-model="time"
          @input="fetchData"
        />
      </div>
    </div>
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
                      v-if="!loading && chartData.labels.length"
                      :data="chartData"
                      :options="chartOptions"
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
                      v-if="!loading && chartDataIncome.labels.length"
                      :data="chartDataIncome"
                      :options="chartOptions"
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
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { ref, computed, onMounted } from "vue";
import { db } from "@/configs/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500, // Giảm thời gian animation
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Biểu đồ của bạn",
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

    const fetchData = async () => {
      loading.value = true;
      try {
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        if (!userId) {
          console.error("Người dùng chưa đăng nhập.");
          loading.value = false;
          return;
        }

        const [year, month] = time.value.split("-").map(Number);

        const transactionsSnapshot = await getDocs(
          collection(db, `users/${userId}/transactions`)
        );
        const incomeSnapshot = await getDocs(
          collection(db, `users/${userId}/income`)
        );

        const transactions = transactionsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const income = incomeSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const filteredTransactions = transactions.filter((item) => {
          const date = new Date(item.time);
          return date.getFullYear() === year && date.getMonth() + 1 === month;
        });

        const filteredIncome = income.filter((item) => {
          const date = new Date(item.time);
          return date.getFullYear() === year && date.getMonth() + 1 === month;
        });

        const groupedTransactions = groupByCategory(filteredTransactions);
        const groupedIncome = groupByCategory(filteredIncome);

        updateChartData(chartData.value, groupedTransactions);
        updateChartData(chartDataIncome.value, groupedIncome);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        loading.value = false;
      }
    };

    const updateChartData = (chart, groupedData) => {
      chart.labels = Object.keys(groupedData);
      chart.datasets[0].data = Object.values(groupedData);
      chart.datasets[0].backgroundColor = chart.labels.map(() =>
        getRandomColor()
      );
    };

    const groupByCategory = (data) => {
      return data.reduce((acc, item) => {
        const category = item.category || "Không phân loại";
        acc[category] = (acc[category] || 0) + item.total;
        return acc;
      }, {});
    };

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      return `#${Array.from({ length: 6 })
        .map(() => letters[Math.floor(Math.random() * 16)]).join("")}`;
    };

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
      fetchData, // Đảm bảo fetchData được gọi khi thay đổi tháng
    };
  },
};
</script>
