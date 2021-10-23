<template>
  <div class="app-container">
    <div v-if="!isUpdate">
      <!-- search form -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="All">
          <el-switch
            v-model="searchForm.isAll"
            @change="handleSwitchAndSearch"
          ></el-switch>
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
        <el-form-item label="Account">
          <el-input
            v-model="searchForm.account"
            placeholder="Enter account"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSwitchAndSearch"
            >Search</el-button
          >
        </el-form-item>
        <el-button
          icon="el-icon-download"
          @click="handleDownload"
          :loading="downloadLoading"
          :disabled="userData.length == 0"
          style="float: right"
          >Download</el-button
        >
      </el-form>

      <div style="margin-top: 20px">
        <!-- brand list table -->
        <el-table
          :data="userData"
          v-loading="tableLoading"
          border
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot="header">
              <span>Operation</span>
            </template>
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="updateUser(row)"
              />
              <el-button
              v-show="row.id != 1"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteUser(row)"
              />
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Name</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.user_name }}</span>
            </template>
          </el-table-column>

        <el-table-column align="center">
            <template slot="header">
              <span>Account</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.account }}</span>
            </template>
          </el-table-column>

        <el-table-column align="center">
            <template slot="header">
              <span>Role</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.user_type.user_role }}</span>
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
          v-if="tableDataCount > 0"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          :page-index="pageIndex"
          :current-page="pageIndex"
          layout="sizes, prev, pager, next"
          :total="tableDataCount"
          style="float: right; margin-top: 5px"
          @size-change="handlePageSizeChange"
          @current-change="handlePageIndexChange"
        />
      </div>
    </div>

    <!-- update form -->
    <el-form
      v-if="isUpdate"
      ref="userForm"
      :model="userForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
    <el-form-item label="name" prop="user_name">
        <el-input v-model="userForm.user_name" ref="user_name"></el-input>
      </el-form-item>
      <el-form-item label="account" prop="account">
        <el-input v-model="userForm.account"></el-input>
      </el-form-item>
      <el-form-item label="Role" prop="user_type">
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
      <el-form-item label="Remarks" prop="remarks">
        <el-input type="textarea" v-model="userForm.remarks"></el-input>
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
import { ListUser } from "@/mixins/people/user/list-user";

export default {
  mixins: [ListUser],
};
</script>
<style>
</style>
