<template>
  <div class="app-container">
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
            @click="editCategory(row)"
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
          <img v-if="row.image" :src="avatar_url + row.id" style="width: 100px; height: 100px;" />
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
    <DeleteDialog v-if="showDeleteDialog" @confirm="confirmDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
<script>
import { ListCategory } from '@/mixins/category/list-category'
export default {
  mixins: [ListCategory]
}
</script>
<style>
</style>
