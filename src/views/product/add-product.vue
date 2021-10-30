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
        <el-input
          v-model="productForm.product_name"
          ref="product_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Bar code" prop="bar_code">
        <el-input v-model="productForm.bar_code"></el-input>
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
      <el-form-item label="Unit" prop="product_type">
        <el-select v-model="productForm.product_type" placeholder="Select unit">
          <el-option
            v-for="item in productTypeList"
            :key="item.id"
            :label="item.unit"
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
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Cost" prop="cost">
        <el-input-number
          v-model="productForm.cost"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Price" prop="price">
        <el-input-number
          v-model="productForm.price"
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
          :picker-options="singleDatePickerOptions"
        />
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
