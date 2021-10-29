<template>
  <div class="app-container">
    <el-form
      ref="productForm"
      :model="productForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Product" prop="product_name">
        <el-select
          v-model="productForm.product"
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
      <el-form-item v-if="productForm.product != null" label="Bar code">
        <span>{{ productForm.bar_code }}</span>
      </el-form-item>
      <el-form-item v-if="productForm.product != null" label="Category">
        <span>{{ productForm.category }}</span>
      </el-form-item>
      <el-form-item v-if="productForm.product != null" label="Brand">
        <span>{{ productForm.brand }}</span>
      </el-form-item>
      <el-form-item label="Store" prop="store">
        <el-select
          v-model="productForm.store"
          placeholder="Select store"
          :disabled="productForm.product == null"
        >
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.store_name"
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
          :disabled="productForm.product == null"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="Unit"
        prop="product_type"
        :disabled="productForm.product == null"
      >
        <el-select
          v-model="productForm.product_type"
          placeholder="Select product type"
          :disabled="productForm.product == null"
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
      <el-form-item label="Price" prop="price">
        <el-input-number
          v-model="productForm.price"
          controls-position="right"
          :min="0"
          :disabled="productForm.product == null"
        ></el-input-number>
        <span> (MMK)</span>
      </el-form-item>
      <el-form-item label="Alert quantity" prop="alert_quantity">
        <el-input-number
          v-model="productForm.alert_quantity"
          controls-position="right"
          :min="0"
          :disabled="productForm.product == null"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Tax" prop="tax">
        <el-input-number
          v-model="productForm.tax"
          controls-position="right"
          :min="0"
          :disabled="productForm.product == null"
        ></el-input-number>
        <span> (MMK)</span>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input
          type="textarea"
          v-model="productForm.remarks"
          :disabled="productForm.product == null"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="info"
          @click="resetForm"
          :disabled="productForm.product == null"
          >Cancel</el-button
        >
        <el-button
          type="primary"
          @click="onExportSubmit"
          :disabled="productForm.product == null"
          ><svg-icon icon-class="export" /> Export</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ExportProduct } from "@/mixins/warehouse/export-product";
export default {
  mixins: [ExportProduct],
};
</script>