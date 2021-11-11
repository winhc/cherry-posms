<template>
  <div class="app-container">
    <el-form
      ref="purchaseForm"
      :model="purchaseForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
    <el-form-item label="Supplier" prop="supplier">
        <el-select v-model="purchaseForm.supplier" placeholder="Select supplier">
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
        <el-button type="info" @click="resetForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddPurchase } from "@/mixins/purchase/add-purchase";

export default {
  mixins: [AddPurchase],
};
</script>
<style>
</style>
