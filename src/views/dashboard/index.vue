<template>
  <div class="dashboard-editor-container">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item v-show="!searchForm.isAll" label="Date">
        <el-date-picker
          v-model="searchForm.dateData"
          type="daterange"
          range-separator="~"
          start-placeholder="Start date"
          end-placeholder="End date"
          :clearable="false"
          format="dd-MM-yyyy"
          :picker-options="pickerOptions"
          @change="changeDatePicker"
        />
      </el-form-item>
    </el-form>

    <panel-group
      :sale-amount="saleAmount"
      :product-count="productCount"
      :purchase-amount="purchaseAmount"
      :user-count="userCount"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <el-row
      v-if="selectedCard == 'sale'"
      style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"
    >
      <sale-line-chart :chart-data="saleLineChartData" />
    </el-row>

    <div v-if="selectedCard == 'product'" class="chart-wrapper">
      <product-bar-chart :chart-data="productBarChartData" />
    </div>

    <div v-if="selectedCard == 'purchase'" class="chart-wrapper">
      <purchase-bar-chart :chart-data="purchaseBarChartData" />
    </div>

    <div v-if="selectedCard == 'user'" class="chart-wrapper">
      <user-bar-chart :chart-data="userBarChartData" />
    </div>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import ProductBarChart from "./components/ProductBarChart.vue";
import SaleLineChart from "./components/SaleLineChart.vue";
import * as ColorGenerator from "@/utils/color-generator";
import PurchaseBarChart from "./components/PurchaseBarChart.vue";
import {
  currentDate,
  formatYearMonthDay,
  formatMonthDay,
} from "@/utils/date-format";
import * as http from "@/utils/http";
import { getErrorMessage } from "@/utils/message-tip";
import * as dateTool from "@/utils/date-tool";
import UserBarChart from "./components/UserBarChart.vue";

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    ProductBarChart,
    SaleLineChart,
    PurchaseBarChart,
    UserBarChart,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: function (date) {
          return new Date(date).getTime() > new Date().getTime();
        },
        shortcuts: [
          {
            text: "Today",
            onClick(picker) {
              picker.$emit("pick", [currentDate(), currentDate()]);
            },
          },
          {
            text: "Yesterday",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [
                formatYearMonthDay(date),
                formatYearMonthDay(date),
              ]);
            },
          },
          {
            text: "For a week",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [date, currentDate()]);
            },
          },
          {
            text: "A week ago",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [date, date]);
            },
          },
        ],
      },
      searchForm: {
        dateData: [currentDate(), currentDate()],
      },
      saleLineChartData: {
        lineLabel: [],
        lineData: [],
      },
      productBarChartData: {
        barLabel: [],
        barData: [],
      },
      purchaseBarChartData: {
        barLabel: [],
        quantityData: [],
        amountData: [],
      },
      userBarChartData: {
        barLabel: [],
        barData: [],
      },
      selectedCard: "sale",
      saleAmount: 0,
      productCount: 0,
      purchaseAmount: 0,
      userCount: 0,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      // this.clearChart();
      const from_date = this.searchForm.dateData[0];
      const to_date = this.searchForm.dateData[1];
      let url = "/dashboards?from_date=" + from_date + "&to_date=" + to_date;

      const response = await http.get(url);
      console.log("dashboard response => ", response);
      if (response != null) {
        const responseData = response.data;
        if (response.status == 200) {
          // count
          this.saleAmount = 0;
          this.productCount = 0;
          this.purchaseAmount = 0;
          this.userCount = 0;

          //sale
          var saleLabelArr = [];
          var saleDataArr = [];
          const dates = dateTool.getDates(
            new Date(from_date),
            new Date(to_date)
          );
          dates.forEach(function (date) {
            saleLabelArr.push(formatMonthDay(date));
            saleDataArr.push(0);
          });
          for (var data of responseData.sale.data) {
            var dateData = formatMonthDay(data.updated_at);
            var index = saleLabelArr.indexOf(dateData);
            if (index != -1) {
              this.saleAmount += data.total_amount;
              saleDataArr[index] += data.total_amount;
            }
          }
          this.saleLineChartData.lineLabel = saleLabelArr;
          this.saleLineChartData.lineData = saleDataArr;

          // product
          var productLabelArr = [];
          var productDataArr = [];
          for (var data of responseData.product.data) {
            productLabelArr.push(data.product_name);
            var productQuantity = 0;
            for (var order of data.orders) {
              productQuantity += order.quantity;
              this.productCount += productQuantity;
            }
            productDataArr.push({
              value: productQuantity,
              itemStyle: { color: ColorGenerator.generateColor() },
            });
          }

          this.productBarChartData.barLabel = productLabelArr;
          this.productBarChartData.barData = productDataArr;
          // console.log('productBarData=> ', this.productBarChartData);

          //purchase
          var purchaseLabelArr = [];
          var purchaseQuantityDataArr = [];
          var purchaseAmountDataArr = [];
          for (var data of responseData.purchase.data) {
            purchaseLabelArr.push(data.product_name);
            var purchaseCost = 0;
            var purchaseQuantity = 0;
            for (var purchase of data.purchases) {
              purchaseQuantity += purchase.quantity;
              purchaseCost += purchase.cost * purchase.quantity;
              this.purchaseAmount += purchaseCost;
            }
            purchaseQuantityDataArr.push({
              value: purchaseQuantity,
              itemStyle: { color: ColorGenerator.generateColor() },
            });
            purchaseAmountDataArr.push(purchaseCost);
          }

          this.purchaseBarChartData.barLabel = purchaseLabelArr;
          this.purchaseBarChartData.quantityData = purchaseQuantityDataArr;
          this.purchaseBarChartData.amountData = purchaseAmountDataArr;
          // console.log("purchaseBarData=> ", this.purchaseBarChartData);

          // user
          var userLabelArr = [];
          var userDataArr = [];

          for (var data of responseData.user.data) {
            userLabelArr.push(data.user_role);
            userDataArr.push({
              value: data.users.length,
              itemStyle: { color: ColorGenerator.generateColor() },
            });
            this.userCount += data.users.length;
          }

          this.userBarChartData.barLabel = userLabelArr;
          this.userBarChartData.barData = userDataArr;
          // console.log("userBarChartData=> ", this.userBarChartData);
        } else {
          this.$message.error(`${getErrorMessage(response)}`);
        }
      }
      this.tableLoading = false;
    },
    handleSetLineChartData(type) {
      console.log(type);
      this.selectedCard = type;
    },
    changeDatePicker(value) {
      // console.log("changeDatePicker => ", value);
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
