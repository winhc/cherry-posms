<template>
  <div class="app-container">
    <el-form
      ref="storeForm"
      :model="storeForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Store name" prop="store_name">
        <el-input v-model="storeForm.store_name" ref="store_name"></el-input>
      </el-form-item>
      <el-form-item label="Store address" prop="address">
        <el-input v-model="storeForm.address" ref="address"></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="storeForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddStore } from "@/mixins/store/add-store";

export default {
  mixins: [AddStore],
};
</script>
<style>
</style>
