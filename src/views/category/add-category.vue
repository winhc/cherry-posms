<template>
  <div class="app-container">
    <el-form
      ref="categoryForm"
      :model="categoryForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Created At">
        <el-input v-model="categoryForm.created_at" readonly></el-input>
      </el-form-item>
      <el-form-item label="Category code">
        <el-input v-model="categoryForm.category_code" readonly></el-input>
      </el-form-item>
      <el-form-item label="Category name" prop="category_name">
        <el-input
          v-model="categoryForm.category_name"
          ref="category_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Image">
        <el-input v-model="categoryForm.image_url"></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="categoryForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddCategory } from "@/mixins/category/add-category";

export default {
  mixins: [AddCategory],
};
</script>
<style>
</style>
