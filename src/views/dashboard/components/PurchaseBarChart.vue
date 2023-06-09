<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import * as numberTool from "@/utils/number-tool";

const animationDuration = 3000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.chartData);
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ barLabel, quantityData, amountData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {},
        grid: {
          //   top: 10,
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: barLabel,
            axisTick: {
              alignWithLabel: true,
            },
            // axisLabel: {
            //   rotate: 30,
            // },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Quantity",
            position: "right",
            axisLabel: {
              formatter: "{value} Qty",
            },
          },
          {
            type: "value",
            name: "Amount",
            position: "left",
            axisLabel: {
              formatter: "{value} MMK",
            },
          },
        ],
        series: [
          {
            name: "Quantity",
            type: "bar",
            barWidth: "60%",
            yAxisIndex: 0,
            data: quantityData,
            animationDuration,
          },
          {
            name: "Amount",
            type: "line",
            smooth: true,
            yAxisIndex: 1,
            data: amountData,
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>
