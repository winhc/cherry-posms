<template>
  <div class="app-container">
    <!-- search form -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="All">
        <el-switch
          v-model="searchForm.isAll"
          @change="handleSwitchAndSearch"
        ></el-switch>
      </el-form-item>
      <el-form-item v-show="!searchForm.isAll" label="Date">
        <el-date-picker
          v-model="searchForm.dateData"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          :clearable="false"
          format="dd-MM-yyyy"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="Sale code">
        <el-input
          v-model="searchForm.sale_code"
          placeholder="Enter sale code"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSwitchAndSearch"
          >Search</el-button
        >
      </el-form-item>
      <el-form-item label="Detail">
        <el-switch v-model="isDetail"></el-switch>
      </el-form-item>
      <el-button
        icon="el-icon-download"
        @click="handleDownload"
        :loading="downloadLoading"
        :disabled="saleData.length == 0"
        style="float: right"
        >Download</el-button
      >
    </el-form>

    <div style="margin-top: 20px">
      <!-- order list table -->
      <el-table
        :data="saleData"
        v-loading="tableLoading"
        border
        style="width: 100%"
      >
        <el-table-column v-if="isDetail" align="center">
          <template slot="header">
            <span>Sale code</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.sale_code }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>User</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.user.user_name }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="isDetail" align="center">
          <template slot="header">
            <span>Amount (MMK)</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.total_amount }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>Pay (MMK)</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.pay }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="isDetail" align="center">
          <template slot="header">
            <span>Refund (MMK)</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.refund }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>Date</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.created_at | moment }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="isDetail" align="center">
          <template slot="header">
            <span>Remarks</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.remarks }}</span>
          </template>
        </el-table-column>
        
      </el-table>
      <el-pagination
        v-if="tableDataCount > 0"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        :page-index="pageIndex"
        :current-page="pageIndex"
        layout="sizes, prev, pager, next"
        :total="tableDataCount"
        style="float: right; margin-top: 5px"
        @size-change="handlePageSizeChange"
        @current-change="handlePageIndexChange"
      />
    </div>
  </div>
</template>
<script>
import { ListSale } from "@/mixins/sale/list-sale";
export default {
  mixins: [ListSale],
};
</script>
<style>
</style>