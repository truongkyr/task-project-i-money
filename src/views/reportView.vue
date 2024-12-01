<template>
  <div>
    <!-- Dropdown chọn năm -->
    <div class="row my-4 mx-auto flex items-center justify-between">
      <select
        id="yearSelect"
        v-model="selectedYear"
        class="border border-gray-400 p-2 ml-2 rounded-lg"
      >
        <!-- Hiển thị Tất cả hoặc các hợp lệ, tránh NaN -->
        <option value="" disabled>Chọn</option>
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>

      <router-link
        :to="{ name: 'ReportDetail', params: {} }"
        class="p-3 rounded-xl border border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
      >
        Xem chi tiết
      </router-link>
    </div>
    <!-- Biểu đồ -->
    <div class="row">
      <div class="bg-white py-4">
        <div class="container mx-auto">
          <label class="font-semibold" for="chart">
            <div class="leading-10 pb-1 text-dark">
              <span class="text-xl flex justify-center">
                <i class="fa-solid fa-chart-bar"></i>
              </span>
              <span class="px-1 text-xs font-bold flex justify-center pt-2">
                Biểu đồ tài chính theo tháng
              </span>
              <span class="text-center block">{{ formattedTime }}</span>
            </div>
            <div class="py-4">
              <div class="container mx-auto">
                <div class="fonsemibold">
                  <div class="leading-10 pb-1">
                    <Bar
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
  </div>
</template>


<script>
import { ref, computed, watch, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  getFirestore,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Đăng ký các thành phần của chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: {
    Bar,
  },
  setup() {
    const months = ref([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ]);
    const transactions = ref([]);
    const income = ref([]);
    const totalExpensesByMonth = ref({});
    const totalIncomeByMonth = ref({});
    const selectedYear = ref(new Date().getFullYear().toString());
    const availableYears = ref([]);
    const loading = ref(true);

    // Lấy dữ liệu từ Firestore
    const fetchData = async () => {
      try {
        loading.value = true;
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        if (!userId) {
          console.error("Người dùng chưa đăng nhập.");
          loading.value = false;
          return;
        }

        const transactionsSnapshot = await getDocs(
          collection(getFirestore(), `users/${userId}/transactions`)
        );
        const incomeSnapshot = await getDocs(
          collection(getFirestore(), `users/${userId}/income`)
        );

        // Chuyển đổi dữ liệu từ Firestore
        transactions.value = transactionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        income.value = incomeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Cập nhật các năm có dữ liệu
        setAvailableYears();

        // Tính toán tổng thu nhập và chi tiêu cho từng tháng
        calculateTotalsByMonth();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loading.value = false;
      }
    };

    // Thiết lập danh sách các năm có dữ liệu từ Firestore
    // Hàm để thiết lập các năm có dữ liệu hợp lệ
    // Thiết lập danh sách các năm có dữ liệu từ Firestore
    const setAvailableYears = () => {
      const years = new Set();

      // Lấy các năm từ các giao dịch và thu nhập
      transactions.value.forEach((t) => {
        const year = new Date(t.time).getFullYear().toString();
        years.add(year);
      });

      income.value.forEach((i) => {
        const year = new Date(i.time).getFullYear().toString();
        years.add(year);
      });

      // Lọc các năm hợp lệ và sắp xếp theo thứ tự giảm dần
      availableYears.value = Array.from(years)
        .filter((year) => !isNaN(year)) // Loại bỏ NaN
        .sort()
        .reverse(); // Sắp xếp năm theo thứ tự giảm dần

      // Kiểm tra và đặt selectedYear thành giá trị hợp lệ nếu có
      if (!availableYears.value.includes(selectedYear.value)) {
        selectedYear.value =
          availableYears.value.length > 0 ? availableYears.value[0] : "";
      }
    };

    // Tính tổng thu nhập và chi tiêu theo từng tháng của năm đã chọn
    const calculateTotalsByMonth = () => {
      const expenses = {};
      const incomes = {};

      months.value.forEach((month) => {
        // Lọc các giao dịch chi tiêu cho từng tháng
        const filteredTransactions = transactions.value.filter(
          (transaction) => {
            let transactionTime = transaction.time;

            // Kiểm tra nếu time tồn tại và là một đối tượng Timestamp hợp lệ
            if (transactionTime instanceof Timestamp) {
              transactionTime = transactionTime.toDate(); // Chuyển từ Timestamp thành Date
            } else if (typeof transactionTime === "string") {
              transactionTime = new Date(transactionTime); // Nếu là chuỗi ngày hợp lệ
            } else if (typeof transactionTime === "number") {
              transactionTime = new Date(transactionTime); // Nếu là Unix timestamp
            } else {
              console.error("Trường `time` không hợp lệ:", transactionTime);
              return false; // Loại bỏ mục không hợp lệ
            }

            const transactionMonth = transactionTime.toISOString().slice(5, 7);
            const transactionYear = transactionTime.getFullYear().toString();
            return (
              transactionMonth === month &&
              transactionYear === selectedYear.value
            );
          }
        );

        // Lọc các thu nhập cho từng tháng
        const filteredIncome = income.value.filter((incomeItem) => {
          let incomeTime = incomeItem.time;

          // Kiểm tra nếu time tồn tại và là một đối tượng Timestamp hợp lệ
          if (incomeTime instanceof Timestamp) {
            incomeTime = incomeTime.toDate(); // Chuyển từ Timestamp thành Date
          } else if (typeof incomeTime === "string") {
            incomeTime = new Date(incomeTime); // Nếu là chuỗi ngày hợp lệ
          } else if (typeof incomeTime === "number") {
            incomeTime = new Date(incomeTime); // Nếu là Unix timestamp
          } else {
            console.error("Trường `time` không hợp lệ:", incomeTime);
            return false; // Loại bỏ mục không hợp lệ
          }

          const incomeMonth = incomeTime.toISOString().slice(5, 7);
          const incomeYear = incomeTime.getFullYear().toString();
          return incomeMonth === month && incomeYear === selectedYear.value;
        });

        // Tính tổng chi tiêu và thu nhập cho từng tháng
        expenses[month] = filteredTransactions.reduce(
          (sum, transaction) => sum + (parseFloat(transaction.total) || 0), // Dùng || 0 để thay thế NaN
          0
        );

        incomes[month] = filteredIncome.reduce(
          (sum, incomeItem) => sum + (parseFloat(incomeItem.total) || 0), // Dùng || 0 để thay thế NaN
          0
        );
      });

      totalExpensesByMonth.value = expenses;
      totalIncomeByMonth.value = incomes;
    };

    // Tính tổng số dư cho cả năm
    const totalBalance = computed(() => {
      return months.value.reduce((sum, month) => {
        const income = totalIncomeByMonth.value[month] || 0;
        const expense = totalExpensesByMonth.value[month] || 0;
        return sum + (income - expense);
      }, 0);
    });

    // Định dạng tiền tệ
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    // Gọi hàm lấy dữ liệu khi component được mounted
    onMounted(fetchData);

    // Theo dõi sự thay đổi của năm đã chọn
    watch(selectedYear, calculateTotalsByMonth);

    // Tạo dữ liệu cho biểu đồ
    const chartData = computed(() => {
      return {
        labels: months.value,
        datasets: [
          {
            label: "Chi tiêu",
            data: months.value.map(
              (month) => totalExpensesByMonth.value[month] || 0
            ),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Thu nhập",
            data: months.value.map(
              (month) => totalIncomeByMonth.value[month] || 0
            ),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Số dư",
            data: months.value.map(
              (month) =>
                (totalIncomeByMonth.value[month] || 0) -
                (totalExpensesByMonth.value[month] || 0)
            ),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
    });

    // Cài đặt các tùy chọn cho biểu đồ
    const chartOptions = ref({
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "THÁNG",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "SỐ TIỀN (VND)",
          },
        },
      },
    });

    const formattedTime = computed(() => selectedYear.value);

    return {
      months,
      totalExpensesByMonth,
      totalIncomeByMonth,
      formatCurrency,
      totalBalance,
      selectedYear,
      availableYears,
      loading,
      chartData,
      chartOptions,
      formattedTime,
    };
  },
};
</script>
