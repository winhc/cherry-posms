<template>
  <div class="app-container">
    <el-tabs v-model="currentTab" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.title"
        :name="item.title"
      >
        <el-table
          v-if="currentTab == 'Warehouse'"
          :data="warehouseProductData"
          v-loading="tableLoading"
          border
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot="header">
              <span>Product Name</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Quantity</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-if="currentTab != 'Warehouse'"
          :data="storeProductData"
          v-loading="tableLoading"
          border
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot="header">
              <span>Product Name</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product.product_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Unit</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product_type.unit }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Quantity</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.quantity }}</span>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { ListInventory } from "@/mixins/inventory/list-inventory";

export default {
  mixins: [ListInventory],
};
</script>
<style>
</style>
