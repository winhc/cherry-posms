<template>
  <div class="pos-container">
    <el-row type="flex" justify="space-between">
      <el-col :span="16">
        <!-- <el-card shadow="never" style="height: 83vh"> -->
        <div>
          <div class="title-text">Category</div>
          <div id="carousel-wrapper">
            <div id="carousel">
              <div
                class="item"
                v-for="(item, index) in categoryList"
                :key="index"
                @click="selectCategory(item)"
              >
                <el-card
                  class="card_style"
                  :style="
                    selectedCategory == item.id
                      ? 'background-color: #1890FF; color: white;'
                      : ''
                  "
                >
                  <div
                    style="
                      display: table;
                      height: 110px;
                      overflow: hidden;
                      margin: auto;
                    "
                  >
                    <div
                      style="
                        display: table-cell;
                        vertical-align: middle;
                        text-align: center;
                      "
                    >
                      <!-- <el-image
                        v-if="item.image"
                        :src="categoryAvatarUrl + item.id + '/' + item.image"
                        fit="fill"
                      ></el-image> -->
                      <div>
                        {{ item.category_name }}
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
          <el-row
            class="title-text"
            style="margin-top: 10px"
            type="flex"
            justify="space-between"
          >
            <el-col :span="15"> Item </el-col>
            <el-col :span="9" style="text-align: right">
              <el-input
                placeholder="Search item"
                v-model="productName"
                size="medium"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getProduct"
                ></el-button>
              </el-input>
            </el-col>
          </el-row>
          <div id="product_list_container">
            <el-row
              v-for="(item, index) in productList"
              :key="index"
              :gutter="10"
              style="margin-bottom: 15px"
            >
              <el-col
                v-for="(subItem, subIndex) in item"
                :key="subIndex"
                :span="4"
              >
                <div @click="selectProduct(subItem)">
                  <el-card class="card_style" shadow="never">
                    <div
                      style="
                        display: table;
                        height: 80px;
                        overflow: hidden;
                        margin: auto;
                      "
                    >
                      <div
                        style="
                          display: table-cell;
                          vertical-align: middle;
                          text-align: center;
                        "
                      >
                        <div>
                          {{ subItem.product_name }}
                        </div>
                      </div>
                    </div>
                    <div style="background: #1890ff">
                      <div
                        style="
                          display: table;
                          height: 28px;
                          overflow: hidden;
                          margin: auto;
                        "
                      >
                        <div
                          style="
                            display: table-cell;
                            vertical-align: middle;
                            text-align: center;
                          "
                        >
                          <div
                            style="color: gray; font-size: 14px; color: white"
                          >
                            {{ subItem.price | numberWithCommas }} Ks
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- </el-card> -->
      </el-col>
      <el-col :span="7">
        <!-- <el-card shadow="never" style="height: 83vh"> -->
        <div class="card_container">
          <el-row class="title-text" type="flex" justify="space-between">
            <el-col :span="12"> Order </el-col>
            <el-col :span="12" style="text-align: right">
              <i
                class="el-icon-delete"
                style="cursor: pointer"
                @click="clearOrder"
              />
            </el-col>
          </el-row>
          <el-select
            v-model="selectedCustomer"
            size="medium"
            style="width: 100%"
          >
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.customer_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <div id="order_list_container">
            <div
              v-for="(item, index) in orderList"
              :key="index"
              id="order_list"
            >
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-row style="margin-bottom: 5px">
                    {{ item.product_name }}
                  </el-row>
                  <el-row style="color: gray; font-size: 14px">
                    Ks {{ item.price }}
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <div>
                    <i
                      class="el-icon-circle-plus-outline"
                      style="color: gray; font-size: 16px; cursor: pointer"
                      @click="handleQuantity(item, 'increase')"
                    ></i>
                  </div>
                  x{{ item.quantity }}
                  <div>
                    <i
                      class="el-icon-remove-outline"
                      style="color: gray; font-size: 16px; cursor: pointer"
                      @click="handleQuantity(item, 'decrease')"
                    ></i>
                  </div>
                </el-col>
                <el-col :span="7" style="color: gray">
                  <el-row style="margin-bottom: 5px">
                    <span style="float: right"
                      >{{
                        (item.quantity * item.price) | numberWithCommas
                      }}
                      Ks</span
                    >
                  </el-row>
                  <el-row>
                    <i
                      style="
                        color: red;
                        float: right;
                        font-size: 14px;
                        cursor: pointer;
                      "
                      class="el-icon-delete"
                      @click="deleteOrderItem(item)"
                    ></i>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
          <div id="bottom_summary">
            <el-row
              type="flex"
              justify="space-between"
              style="margin-bottom: 10px"
            >
              <el-col :span="12"> Quantity </el-col>
              <el-col :span="12" style="text-align: right">
                {{ totalQuantity }}
              </el-col>
            </el-row>
            <el-row
              type="flex"
              justify="space-between"
              style="margin-bottom: 20px"
            >
              <el-col :span="12"> Total </el-col>
              <el-col :span="12" style="text-align: right">
                {{ totalAmount | numberWithCommas }} Ks
              </el-col>
            </el-row>
            <el-button
              type="primary"
              style="width: 100%"
              @click="showSaleDetail = true"
              :disabled="orderList.length <= 0"
              >Pay {{ totalAmount | numberWithCommas }} Ks</el-button
            >
          </div>
        </div>
        <!-- </el-card> -->
      </el-col>
    </el-row>

    <!-- sale invoice detail dialog -->
    <el-dialog
      title="Sale Detail"
      :visible.sync="showSaleDetail"
      width="50%"
      center
    >
      <div>
        <div style="text-align: center">
          Date: {{ saleDate }} <br />
          <br />
          Sold By: {{ $store.getters.userInfo.user_name }} <br />
          <br />
          Sold To: {{ currentCustomer }} <br />
          <br />
        </div>
        <el-table
          v-if="showSaleDetail"
          :data="orderList"
          style="width: 100%; margin-top: 20px"
          border
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column align="center" width="200">
            <template slot="header">
              <span>Item</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.product_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Qty</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template slot="header">
              <span>Price</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ row.price | numberWithCommas }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="total" align="center">
            <template slot="header">
              <span>Total</span>
            </template>
            <template slot-scope="{ row }">
              <span>{{ (row.quantity * row.price) | numberWithCommas }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button style="width: 100%" type="primary" @click="createOrder"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { POS } from "@/mixins/pos";

export default {
  mixins: [POS],
};
</script>
<style>
#order_list_container {
  margin-top: 10px;
  height: 68%;
  /* background-color: yellow; */
  overflow-y: auto;
}
#product_list_container {
  height: 75%;
  padding-bottom: 10px;
  /* padding-top: 10px; */
  /* background-color: yellow; */
  overflow-y: auto;
}
#order_list {
  margin-bottom: 2px;
  background-color: white;
  border: 1px solid #ebe9e9;
  border-radius: 5px;
  padding: 5px;
}
.card_container {
  background-color: white;
  height: 85vh;
  width: 100%;
  padding: 20px;
  position: relative;
}
#bottom_summary {
  position: absolute;
  bottom: 0;
  /* background-color: blue; */
  min-height: 110px;
  width: 89%;
  padding-top: 10px;
  padding-bottom: 10px;
}
.pos-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  /* height: 88vh; */
}
#carousel-wrapper {
  position: relative;
  width: 100%;
  border: none;
}
#carousel {
  width: 100%;
  height: 120px;
  overflow: scroll;
  overflow-y: hidden !important;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.item {
  display: inline-block;
  width: 110px;
  height: 205px;
  /* cursor: pointer; */
}

.badge-item {
  margin-top: 20px;
  margin-right: 40px;
}

.image {
  width: 100%;
  display: block;
}

.card_style {
  width: 100px;
  height: 110px;
  cursor: pointer;
}
.title-text {
  font-size: 20px;
  margin-bottom: 10px;
}
.horizontal-scroll-view {
  overflow: auto;
  white-space: nowrap;
}
.el-card__body {
  padding: 0px;
}
</style>
