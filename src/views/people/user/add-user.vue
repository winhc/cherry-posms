<template>
  <div class="app-container">
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Name" prop="user_name">
        <el-input v-model="userForm.user_name" ref="user_name"></el-input>
      </el-form-item>
      <el-form-item label="account" prop="account">
        <el-input v-model="userForm.account"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item label="User type" prop="user_type">
        <el-select v-model="userForm.user_type" placeholder="Select user type">
          <el-option
            v-for="item in userTypeList"
            :key="item.id"
            :label="item.user_role"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="userForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetForm">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddUser } from "@/mixins/people/user/add-user";

export default {
  mixins: [AddUser],
};
</script>
<style>
</style>
