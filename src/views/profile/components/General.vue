<template>
  <div>
    <el-divider>Account</el-divider>
    <el-form ref="accountForm" :model="accountForm" :rules="accountRule">
      <el-form-item label="Name" prop="name">
        <el-input v-model="accountForm.name" />
      </el-form-item>
      <el-form-item label="Login Account" prop="account">
        <el-input v-model="accountForm.account" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitUpdateAccount"
          >Update Account</el-button
        >
      </el-form-item>
    </el-form>

    <el-divider>Password</el-divider>
    <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRule">
      <el-form-item label="Current password">
        <el-input v-model="passwordForm.current_password" readonly disabled />
      </el-form-item>
      <el-form-item label="New password" prop="new_password">
        <el-input type="password" v-model="passwordForm.new_password" />
      </el-form-item>
      <el-form-item label="Re-type new password" prop="retype_new_password">
        <el-input type="password" v-model="passwordForm.retype_new_password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitUpdatePassword"
          >Update Password</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as http from "@/utils/http";
import { getErrorMessage } from "@/utils/message-tip";
import { MessageBox } from "element-ui";
import store from "@/store";
import router from "@/router";

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    const validateAccount = (rule, value, callback) => {
      if (value == "") {
        callback(new Error(`Enter account`));
      } else if (value.length < 6) {
        callback(new Error(`Account can't be less than 6 digit`));
      } else {
        callback();
      }
    };
    const validateNewPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error(`Enter new password`));
      } else if (value.length < 6) {
        callback(new Error(`New pasword can't be less than 6 digit`));
      } else {
        callback();
      }
    };
    const validateRetypeNewPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error(`Enter new password again`));
      } else if (value.length < 6) {
        callback(new Error(`New password can't be less than 6 digit`));
      } else if (value != this.passwordForm.new_password) {
        callback(new Error(`Re-type password must same with new password`));
      } else {
        callback();
      }
    };
    return {
      accountForm: {
        name: this.user.name,
        account: this.user.account,
      },
      passwordForm: {
        current_password: this.user.password,
        new_password: "",
        retype_new_password: "",
      },
      accountRule: {
        name: [{ required: true, message: "Enter name", trigger: "blur" }],
        account: [
          { required: true, trigger: "blur", validator: validateAccount },
        ],
      },
      passwordRule: {
        new_password: [
          { required: true, trigger: "blur", validator: validateNewPassword },
        ],
        retype_new_password: [
          {
            required: true,
            trigger: "blur",
            validator: validateRetypeNewPassword,
          },
        ],
      },
    };
  },
  methods: {
    onSubmitUpdateAccount() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          this.updateAccount();
        } else {
          return false;
        }
      });
    },
    onSubmitUpdatePassword() {
      this.$refs.passwordForm.validate((valid) => {
        console.log(`passwordForm => ${this.passwordForm}`);
        if (valid) {
          this.updatePassword();
        } else {
          return false;
        }
      });
    },

    async updateAccount() {
      console.log("updateAccount");
      const response = await http.patch(
        `/users/${this.user.id}`,
        this.accountForm
      );
      console.log("updateAccount response =>", response);
      if (response != null) {
        if (response.status == 200) {
          MessageBox.alert(`Please, login again`, `Update account success`, {
            confirmButtonText: "OK",
            showClose: false,
            callback: (action) => {
              this.logout();
            },
          });
        } else {
          this.$message.error(`${getErrorMessage(response)}`);
        }
      }
    },
    async updatePassword() {
      console.log("updatePassword");
      const updatePasswordForm = {
        current_password: this.passwordForm.current_password,
        new_password: this.passwordForm.new_password,
      };
      const response = await http.patch(
        `/users/password/${this.user.id}`,
        updatePasswordForm
      );
      console.log("updatePassword response =>", response);
      if (response != null) {
        if (response.status == 200) {
          MessageBox.alert(`Please, login again`, `Update password success`, {
            confirmButtonText: "OK",
            showClose: false,
            callback: (action) => {
              this.logout();
            },
          });
        } else {
          this.$message.error(`${getErrorMessage(response)}`);
        }
      }
    },
    async logout() {
      await store.dispatch("user/logout");
      router.push(`/login`);
    },
  },
};
</script>
