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
        <div v-if="imageUrl" class="image_container">
          <img :src="imageUrl" class="avatar" />
          <div class="icon_delete_container">
            <div class="icon_delete">
              <i class="el-icon-delete" @click="deleteImage" />
            </div>
          </div>
        </div>
        <el-upload
          v-else
          class="avatar-uploader"
          action=""
          accept="image/*"
          :show-file-list="false"
          :on-change="handleUploadChange"
          :auto-upload="false"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="categoryForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetCategoryForm">Reset</el-button>
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 6px;
  padding: 1px;
}
.image_container {
  position: relative;
  width: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
}
.icon_delete_container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5);
}
.image_container:hover .icon_delete_container {
  opacity: 1;
  border-radius: 6px;
}
.icon_delete {
  font-size: 20px;
  color: white;
  top: 100%;
  left: 50%;
  text-align: center;
  transform: translate(0%, 170%);
}
</style>
