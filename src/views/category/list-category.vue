<template>
  <div class="app-container">
    <el-table :data="categoryData" border style="width: 100%">
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
          <span>Category Name</span>
        </template>
        <template slot-scope="{ row }">
          <span>{{ row.category_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header">
          <span>Created At</span>
        </template>
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header">
          <span>Updated At</span>
        </template>
        <template slot-scope="{ row }">
          <span>{{ row.updated_at }}</span>
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
