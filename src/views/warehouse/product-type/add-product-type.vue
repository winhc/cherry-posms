<template>
  <div class="app-container">
    <el-form
      ref="productTypeForm"
      :model="productTypeForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Unit" prop="unit">
        <el-input
          v-model="productTypeForm.unit"
          ref="unit"
        ></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="productTypeForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetProductTypeForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddProductType } from "@/mixins/warehouse/product-type/add-product-type";

export default {
  mixins: [AddProductType],
};
</script>
<style>
</style>
