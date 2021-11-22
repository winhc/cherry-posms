<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="All">
        <el-switch
          v-model="searchForm.isAll"
          @change="handleSwitchAndSearch"
        ></el-switch>
      </el-form-item>
      <el-form-item v-if="!searchForm.isAll" label="Date">
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
      <el-form-item v-if="!searchForm.isAll">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSwitchAndSearch"
          >Search</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Sale Value</div>
            <count-to
              :start-val="0"
              :end-val="saleValue"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-component">
            <svg-icon icon-class="component" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Quantity</div>
            <count-to
              :start-val="0"
              :end-val="productCount"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-purchase">
            <svg-icon icon-class="purchase" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Purchase Value</div>
            <count-to
              :start-val="0"
              :end-val="purchaseValue"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-profits">
            <svg-icon icon-class="profits" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Profit Value</div>
            <count-to
              :start-val="0"
              :end-val="profitValue"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <div style="margin-top: 20px">
      <el-table
        :data="saleData"
        v-loading="tableLoading"
        border
        style="width: 100%"
      >
        <el-table-column align="center">
          <template slot="header">
            <span>Date</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.updated_at | moment }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>Product</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.product.product_name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>Quantity</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.quantity }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>Purchase</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.quantity * row.product.cost }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>Sale</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{ row.quantity * row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <span>Profit</span>
          </template>
          <template slot-scope="{ row }">
            <span>{{
              row.quantity * row.price - row.quantity * row.product.cost
            }}</span>
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
</template>
<script>
import { SaleReport } from "@/mixins/report/sale-report";
export default {
  mixins: [SaleReport],
};
</script>
<style lang="scss" scoped>
.report-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
.panel-group {
  margin-top: 10px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-purchase {
        background: #329c9b;
      }

      .icon-profits {
        background: #36a3f7;
      }

      .icon-component {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-purchase {
      color: #329c9b;
    }

    .icon-profits {
      color: #36a3f7;
    }

    .icon-component {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>