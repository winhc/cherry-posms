<template>
  <div class="pos-container">
    <el-row type="flex" justify="space-between">
      <el-col :span="16">
        <!-- <el-card shadow="never" style="height: 83vh"> -->
        <div class="card_container">
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
                      ? 'background-color: yellow'
                      : ''
                  "
                >
                  <div>
                    <el-image
                      v-if="item.image"
                      :src="categoryAvatarUrl + item.id + '/' + item.image"
                      fit="fill"
                    ></el-image>
                    <div class="label-text">
                      {{ item.category_name }}
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
          <div class="title-text" style="margin-top: 10px">Item</div>
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
                    {{ subItem.product_name }}
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
            size="small"
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
                <el-col :span="15">
                  <el-row style="margin-bottom: 5px">
                    {{ item.product_name }}
                  </el-row>
                  <el-row style="color: gray; font-size: 14px">
                    K {{ item.price }}
                  </el-row>
                </el-col>
                <el-col :span="3">x{{ item.quantity }}</el-col>
                <el-col :span="6" style="color: gray">
                  {{ item.quantity * item.price }} Ks
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
                {{ totalAmount }} Ks
              </el-col>
            </el-row>
            <el-button type="primary" style="width: 100%"
              >Charge 100,000 Ks</el-button
            >
          </div>
        </div>
        <!-- </el-card> -->
      </el-col>
    </el-row>
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
  margin-top: 10px;
  height: 75%;
  padding-bottom: 30px;
  padding-top: 10px;
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
  height: 83vh;
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
  height: 88vh;
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

.image {
  width: 100%;
  display: block;
}

.card_style {
  width: 100px;
  height: 110px;
  cursor: pointer;
}
.label-text {
  text-align: center;
}
.title-text {
  font-size: 20px;
  margin-bottom: 10px;
}
.horizontal-scroll-view {
  overflow: auto;
  white-space: nowrap;
}
</style>
