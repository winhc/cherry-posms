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
            :picker-options="rangeDatePickerOptions"
          />
        </el-form-item>
        <el-form-item label="Product name">
          <el-input
            v-model="searchForm.product_name"
            placeholder="Enter product name"
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
          :disabled="productData.length == 0"
          style="float: right"
          >Download</el-button
        >
      </el-form>

      <div style="margin-top: 20px">
        <!-- product list table -->
        <el-table
          :data="productData"
          v-loading="tableLoading"
          border
          style="width: 100%"
        >
          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Operation</span>
            </template>
            <template slot-scope="{ row }">
              <el-tooltip effect="dark" content="Edit" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="medium"
                  circle
                  @click="updateProduct(row)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="Delete" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="medium"
                  circle
                  @click="deleteProduct(row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
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

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Product Name</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Product Code</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product_code }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Bar Code</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.bar_code ? row.bar_code : '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Category</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.category ? row.category.category_name : '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Brand</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.brand ? row.brand.brand_name : '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Unit</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product_type ? row.product_type.unit : '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Quantity</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Cost</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.cost}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Price</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.price}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Alert quantity</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.alert_quantity ? row.alert_quantity : '-'}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Expiry At</span>
            </template>
            <template slot-scope="{ row }">
              <span v-if="row.expiry_at">{{ row.expiry_at | moment }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Created At</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.created_at | moment }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150">
            <template slot="header">
              <span>Updated At</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.updated_at | moment }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="200">
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
      ref="productForm"
      :model="productForm"
      :rules="rules"
      label-width="150px"
      style="width: 60%"
    >
      <el-form-item label="Product name" prop="product_name">
        <el-input v-model="productForm.product_name"></el-input>
      </el-form-item>
      <el-form-item label="Bar code" prop="bar_code">
        <el-input v-model="productForm.bar_code"></el-input>
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-select v-model="productForm.category" placeholder="Select category">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Brand" prop="brand">
        <el-select v-model="productForm.brand" placeholder="Select brand">
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.brand_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Unit" prop="unit">
        <el-select v-model="productForm.product_type" placeholder="Select unit">
          <el-option
            v-for="item in productTypeList"
            :key="item.id"
            :label="item.unit"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Quantity" prop="quantity">
        <el-input-number
          v-model="productForm.quantity"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Cost" prop="cost">
        <el-input-number
          v-model="productForm.cost"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Price" prop="price">
        <el-input-number
          v-model="productForm.price"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Alert quantity" prop="alert_quantity">
        <el-input-number
          v-model="productForm.alert_quantity"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Expiry at">
        <el-date-picker
          v-model="productForm.expiry_at"
          type="date"
          :clearable="true"
          format="dd-MM-yyyy"
          placeholder="Pick expiry date"
          :picker-options="singleDatePickerOptions"
        />
      </el-form-item>
      <el-form-item label="Image">
        <UploadImage
          :is-reset-image="isResetImage"
          :image-path="imageUrl"
          @deleteImage="deleteImage"
          @handleUploadChange="handleUploadChange"
        />
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="productForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetForm">Cancel</el-button>
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
import { ListProduct } from "@/mixins/product/list-product";

export default {
  mixins: [ListProduct],
};
</script>
<style>
</style>
