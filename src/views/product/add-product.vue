<template>
  <div class="app-container">
    <el-form
      ref="productForm"
      :model="productForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Product code">
        <el-input v-model="productForm.product_code" readonly></el-input>
      </el-form-item>
      <el-form-item label="Product name" prop="product_name">
        <el-input
          v-model="productForm.product_name"
          ref="product_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-select v-model="productForm.category" placeholder="Select category">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Product type" prop="product_type">
        <el-select
          v-model="productForm.product_type"
          placeholder="Select product type"
        >
          <el-option
            v-for="item in productTypeList"
            :key="item.id"
            :label="item.product_type_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Brand" prop="brand">
        <el-select v-model="productForm.brand" placeholder="Select brand">
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.brand_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Supplier" prop="supplier">
        <el-select v-model="productForm.supplier" placeholder="Select supplier">
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.supplier_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Buy unit price" prop="buy_unit_price">
        <el-input-number
          v-model="productForm.buy_unit_price"
          controls-position="right"
          :min="0"
        ></el-input-number>
        <span> (MMK)</span>
      </el-form-item>
      <el-form-item label="Sell unit price" prop="sell_unit_price">
        <el-input-number
          v-model="productForm.sell_unit_price"
          controls-position="right"
          :min="0"
        ></el-input-number>
        <span> (MMK)</span>
      </el-form-item>
      <el-form-item label="Tax" prop="tax">
        <el-input-number
          v-model="productForm.tax"
          controls-position="right"
          :min="0"
        ></el-input-number>
        <span> (MMK)</span>
      </el-form-item>
      <el-form-item label="Quantity" prop="quantity">
        <el-input-number
          v-model="productForm.quantity"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Alert quantity" prop="alert_quantity">
        <el-input-number
          v-model="productForm.alert_quantity"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Expiry at">
        <el-date-picker
          v-model="productForm.expiry_at"
          type="date"
          :clearable="true"
          format="dd-MM-yyyy"
          placeholder="Pick expiry date"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="For sale">
        <el-switch v-model="productForm.for_sale"></el-switch>
      </el-form-item>
      <el-form-item label="Image">
        <UploadImage
          :is-reset-image="isResetImage"
          @deleteImage="deleteImage"
          @handleUploadChange="handleUploadChange"
        />
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="productForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddProduct } from "@/mixins/product/add-product";

export default {
  mixins: [AddProduct],
};
</script>
<style>
</style>
