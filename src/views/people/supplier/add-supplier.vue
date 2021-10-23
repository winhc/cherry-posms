<template>
  <div class="app-container">
    <el-form
      ref="supplierForm"
      :model="supplierForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Supplier name" prop="supplier_name">
        <el-input v-model="supplierForm.supplier_name" ref="supplier_name"></el-input>
      </el-form-item>
      <el-form-item label="Phone number" prop="phone">
        <el-input type="phone" v-model="supplierForm.phone"  maxlength="9">
            <template slot="prepend">09</template>
          </el-input>
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="supplierForm.address"></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="supplierForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddSupplier } from "@/mixins/people/supplier/add-supplier";

export default {
  mixins: [AddSupplier],
};
</script>
<style>
</style>
