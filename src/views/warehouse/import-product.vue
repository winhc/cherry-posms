<template>
  <div class="app-container">
    <el-form
      ref="productForm"
      :model="productForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Product name" prop="product_name">
        <el-select
          v-model="productForm.product_data"
          placeholder="Select product"
          @change="selectProduct"
        >
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :label="item.product_name"
            :value="index"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="productForm.product_data != null" label="Category">
        <span>{{ productForm.category }}</span>
      </el-form-item>
      <el-form-item v-if="productForm.product_data != null" label="Brand">
        <span>{{ productForm.brand }}</span>
      </el-form-item>
      <el-form-item label="Bar code" prop="bar_code">
        <el-input
          minlength="13"
          maxlength="13"
          v-model="productForm.bar_code"
          style="width: 190px"
        ></el-input>
      </el-form-item>
      <el-form-item label="Supplier" prop="supplier">
        <el-select
          v-model="productForm.supplier"
          placeholder="Select supplier"
          :disabled="productForm.product_data == null"
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
      <el-form-item label="Quantity" prop="quantity">
        <el-input-number
          v-model="productForm.quantity"
          controls-position="right"
          :min="0"
          :disabled="productForm.product_data == null"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Unit" prop="product_type">
        <el-select
          v-model="productForm.product_type"
          placeholder="Select product type"
          :disabled="productForm.product_data == null"
        >
          <el-option
            v-for="item in productTypeList"
            :key="item.id"
            :label="item.unit"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cost" prop="cost">
        <el-input-number
          v-model="productForm.cost"
          controls-position="right"
          :min="0"
          :disabled="productForm.product_data == null"
        ></el-input-number>
        <span> (MMK)</span>
      </el-form-item>
      <el-form-item label="Alert quantity" prop="alert_quantity">
        <el-input-number
          v-model="productForm.alert_quantity"
          controls-position="right"
          :min="0"
          :disabled="productForm.product_data == null"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Expiry at">
        <el-date-picker
          v-model="productForm.expiry_at"
          type="date"
          :clearable="true"
          format="dd-MM-yyyy"
          placeholder="Pick expiry date"
          :picker-options="singleDatePickerOptions"
          :disabled="productForm.product_data == null"
        />
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input
          type="textarea"
          v-model="productForm.remarks"
          :disabled="productForm.product_data == null"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="info"
          @click="resetForm"
          :disabled="productForm.product_data == null"
          >Cancel</el-button
        >
        <el-button
          type="primary"
          @click="onImportSubmit"
          :disabled="productForm.product_data == null"
          ><svg-icon icon-class="import" /> Import</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ImportProduct } from "@/mixins/warehouse/import-product";

export default {
  mixins: [ImportProduct],
};
</script>
<style>
</style>