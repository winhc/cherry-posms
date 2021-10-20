<template>
  <div class="app-container">
    <el-form
      ref="userTypeForm"
      :model="userTypeForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="User role" prop="user_role">
        <el-input v-model="userTypeForm.user_role" ref="user_role"></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="userTypeForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetUserType">Reset</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AddUserType } from "@/mixins/user-type/add-user-type";

export default {
  mixins: [AddUserType],
};
</script>
<style>
</style>
