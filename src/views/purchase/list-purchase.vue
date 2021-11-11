<template>
  <div class="app-container">
    <div v-if="!isUpdate">
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
        <el-form-item label="Brand name">
          <el-input
            v-model="searchForm.supplier_name"
            placeholder="Enter supplier name"
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
          :disabled="purchaseData.length == 0"
          style="float: right"
          >Download</el-button
        >
      </el-form>

      <el-alert
        v-show="messageAlert.isShow"
        :title="messageAlert.title"
        :type="messageAlert.isSuccess ? 'success' : 'error'"
        effect="dark"
        show-icon
        @close="closeAlert"
      />

      <div style="margin-top: 20px">
        <!-- brand list table -->
        <el-table
          :data="purchaseData"
          v-loading="tableLoading"
          border
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot="header">
              <span>Operation</span>
            </template>
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="updatePurchase(row)"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deletePurchase(row)"
              />
            </template>
          </el-table-column>

          <el-table-column v-if="isDetail" align="center">
            <template slot="header">
              <span>Product</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product.product_name }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="isDetail" align="center">
            <template slot="header">
              <span>Supplier</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.supplier.supplier_name }}</span>
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

          <el-table-column align="center">
            <template slot="header">
              <span>Total Cost</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.quantity * row.cost }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span> Date </span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.updated_at | moment }}</span>
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

    <!-- update form -->
    <el-form
      v-if="isUpdate"
      ref="purchaseForm"
      :model="purchaseForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Supplier" prop="supplier">
        <el-select
          v-model="purchaseForm.supplier"
          placeholder="Select supplier"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.supplier_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Product" prop="product">
        <el-select v-model="purchaseForm.product" placeholder="Select product">
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.product_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Quantity" prop="quantity">
        <el-input-number
          v-model="purchaseForm.quantity"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Unit Cost" prop="cost">
        <el-input-number
          v-model="purchaseForm.cost"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="purchaseForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="isUpdate = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Update</el-button>
      </el-form-item>
    </el-form>

    <!-- delete dialog -->
    <DeleteDialog
      v-if="showDeleteDialog"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>
<script>
import { ListPurchase } from "@/mixins/purchase/list-purchase";

export default {
  mixins: [ListPurchase],
};
</script>
<style>
</style>
