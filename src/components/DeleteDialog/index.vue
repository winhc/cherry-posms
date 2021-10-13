<template>
  <el-dialog
    title="Are you sure to delete?"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form
      ref="deleteForm"
      label-position="top"
      label-width="120px"
      :model="deleteForm"
      :rules="rules"
    >
      <el-form-item label="Remarks" prop="remarks">
        <el-input v-model="deleteForm.remarks" type="textarea" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">Cancel</el-button>
      <el-button type="primary" @click="confirmDialog">Confirm</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: true,
      deleteForm: {
        remarks: "",
      },
      rules: {
        remarks: [
          { required: true, message: "Enter remarks", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    confirmDialog() {
      this.$refs.deleteForm.validate((valid) => {
        if (valid) {
          this.cancelDialog();
          this.$emit("confirm", this.deleteForm.remarks);
        } else {
          console.log("error onSubmit!!");
          return false;
        }
      });
    },
    handleClose() {
      this.cancelDialog();
    },
    cancelDialog() {
      this.dialogVisible = false;
      this.$emit("cancel");
    },
  },
};
</script>
<style>
</style>
