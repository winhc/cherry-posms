<template>
  <div>
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
  </div>
</template>
<script>
export default {
  props: {
    isResetImage: {
      required: true,
      type: Boolean,
      default: false
    },
    imagePath: {
      required: false,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: this.imagePath,
      imageFile: null,
    };
  },
  watch: {
    isResetImage() {
      console.log('isResetImage', this.isResetImage);
      if(this.isResetImage){
        this.imageUrl = "";
        this.imageFile = null;
      }else{
        console.log('isResetImage else', this.isResetImage);
      }
    }
  },
  methods: {
    deleteImage() {
      this.imageUrl = "";
      this.imageFile = null;
      this.$emit('deleteImage', this.imageFile);
    },
    handleUploadChange(file) {
      console.log("upload image component==>", file);
      if (file) {
        this.imageFile = file;
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$emit('handleUploadChange', this.imageFile);
      } else {
        console.log("no file");
      }
    },
  },
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