<template>
  <div>
    <div class="row">
      <div class="py-4 w-48 mb-4 bg-primary rounded-lg border-dark ml-1 text-center">
        <input
          type="month"
          class="bg-primary text-white"
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
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ref, onMounted, watch, computed } from 'vue';
import { db } from '@/configs/firebase';
import { collection, getDocs } from 'firebase/firestore';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: 'PieChart',
  components: {
    Pie,
  },
  setup() {
    const time = ref(new Date().toISOString().slice(0, 7));
    const loading = ref(true);

    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: 'Số tiền',
          data: [],
          backgroundColor: [],
        },
      ],
    });

    const chartDataIncome = ref({
      labels: [],
      datasets: [
        {
          label: 'Số tiền',
          data: [],
          backgroundColor: [],
        },
      ],
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
    });

    const fetchData = async () => {
      loading.value = true; // Bắt đầu tải dữ liệu
      try {
        const selectedYearMonth = time.value.split('-');
        const selectedYear = parseInt(selectedYearMonth[0]);
        const selectedMonthNum = parseInt(selectedYearMonth[1]);

        const transactionsSnapshot = await getDocs(
          collection(db, 'transactions')
        );
        const transactionsDocs = transactionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const incomeSnapshot = await getDocs(collection(db, 'income'));
        const incomeDocs = incomeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredTransactions = transactionsDocs.filter(
          (transaction) => {
            const transactionDate = new Date(transaction.time);
            return (
              transactionDate.getFullYear() === selectedYear &&
              transactionDate.getMonth() + 1 === selectedMonthNum
            );
          }
        );

        const filteredIncome = incomeDocs.filter((income) => {
          const incomeDate = new Date(income.time);
          return (
            incomeDate.getFullYear() === selectedYear &&
            incomeDate.getMonth() + 1 === selectedMonthNum
          );
        });

        const groupedData = filteredTransactions.reduce((acc, transaction) => {
          const category = transaction.category || 'Không phân loại';
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += transaction.total;
          return acc;
        }, {});

        const groupedDataIncome = filteredIncome.reduce((acc, income) => {
          const category = income.category || 'Không phân loại';
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += income.total;
          return acc;
        }, {});

        chartData.value.labels = Object.keys(groupedData);
        chartData.value.datasets[0].data = Object.values(groupedData);
        chartData.value.datasets[0].backgroundColor = chartData.value.labels.map(
          () => getRandomColor()
        );

        chartDataIncome.value.labels = Object.keys(groupedDataIncome);
        chartDataIncome.value.datasets[0].data = Object.values(
          groupedDataIncome
        );
        chartDataIncome.value.datasets[0].backgroundColor =
          chartDataIncome.value.labels.map(() => getRandomColor());
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu giao dịch:', error);
      } finally {
        loading.value = false; // Hoàn thành tải dữ liệu
      }
    };

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const formattedTime = computed(() => {
      const date = new Date(time.value + '-01');
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric' });
    });

    onMounted(fetchData);
    watch(time, fetchData);

    return {
      chartData,
      chartDataIncome,
      chartOptions,
      time,
      loading,
      formattedTime,
    };
  },
};
</script>
