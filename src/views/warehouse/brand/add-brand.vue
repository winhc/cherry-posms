<template>
  <div class="app-container">
    <el-form
      ref="brandForm"
      :model="brandForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Brand name" prop="brand_name">
        <el-input
          v-model="brandForm.brand_name"
          ref="brand_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="brandForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetBrandForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddBrand } from "@/mixins/warehouse/brand/add-brand";

export default {
  mixins: [AddBrand],
};
</script>
<style>
</style>
