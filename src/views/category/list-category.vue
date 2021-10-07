<template>
  <div class="app-container">
    <div v-if="!isUpdate">
      <!-- search form -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="All">
          <el-switch v-model="searchForm.isAll"></el-switch>
        </el-form-item>
        <el-form-item v-show="!searchForm.isAll" label="Date">
          <el-date-picker
            v-model="searchForm.dateData"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :clearable="false"
            format="dd-MM-yyyy"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="Category name">
          <el-input
            v-model="searchForm.category_name"
            placeholder="Enter category name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getData"
            >Search</el-button
          >
        </el-form-item>
      </el-form>

      <div style="margin-top: 20px">
        <!-- category list table -->
        <el-table :data="categoryData" border style="width: 100%">
          <el-table-column align="center">
            <template slot="header">
              <span>Operation</span>
            </template>
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="updateCategory(row)"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteCategory(row)"
              />
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Image</span>
            </template>
            <template slot-scope="{ row }">
              <img
                v-if="row.image"
                :src="avatar_url + row.id + '/' + row.image"
                style="width: 100px; height: 100px"
              />
              <i v-else class="el-icon-camera" />
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Category Name</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.category_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Category Code</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.category_code }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Created At</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.created_at | moment }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Updated At</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.updated_at | moment }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Remarks</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.remarks }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :page-sizes="[10,20,30]"
          :page-size="pageSize"
          :page-index="pageIndex"
          layout="sizes, prev, pager, next"
          :total="tableDataCount"
          style="float:right;margin-top: 5px"
          @size-change="handlePageSizeChange"
          @current-change="handlePageIndexChange"
        />
      </div>
    </div>

    <!-- update form -->
    <el-form
      v-if="isUpdate"
      ref="categoryForm"
      :model="categoryForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Category name" prop="category_name">
        <el-input
          v-model="categoryForm.category_name"
          ref="category_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Image">
        <UploadImage
          :is-reset-image="isResetImage"
          :image-path="imageUrl"
          @deleteImage="deleteImage"
          @handleUploadChange="handleUploadChange"
        />
      </el-form-item>
      <el-form-item label="Remarks" prop="remarks">
        <el-input type="textarea" v-model="categoryForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="isUpdate = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Update</el-button>
      </el-form-item>
    </el-form>

    <!-- delete dialog -->
    <DeleteDialog
      v-if="showDeleteDialog"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>
<script>
import { ListCategory } from "@/mixins/category/list-category";
export default {
  mixins: [ListCategory],
};
</script>
<style>
</style>
