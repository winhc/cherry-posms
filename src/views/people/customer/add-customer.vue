<template>
  <div class="app-container">
    <el-form
      ref="customerForm"
      :model="customerForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Customer name" prop="customer_name">
        <el-input
          v-model="customerForm.customer_name"
          ref="customer_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Phone number" prop="phone">
        <el-input type="phone" v-model="customerForm.phone" maxlength="9">
          <template slot="prepend">09</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="customerForm.address"></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="customerForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddCustomer } from "@/mixins/people/customer/add-customer";

export default {
  mixins: [AddCustomer],
};
</script>
<style>
</style>
