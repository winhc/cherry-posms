import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'

export const POS = {
    components: { DeleteDialog },
    props: {},
    data() {
        return {
            categoryAvatarUrl: process.env.VUE_APP_CATEGORY_AVATAR_API,
            categoryList: [],
            selectedCategory: 0,
            productList: [],
            customerList: [],
            selectedCustomer: 1,
            orderList: [],
            totalQuantity: 0,
            totalAmount: 0,
        }
    },
    mounted() { },
    created() {
        this.getPOSOption();
    },
    destroyed() { },
    methods: {
        async getPOSOption() {
            const response = await http.get('/pos');
            console.log('pos option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.customerList = response.data.customer.data;
                    this.categoryList = response.data.category.data;
                    const all = {
                        id: 0,
                        category_name: 'All',
                        image: null
                    };
                    this.categoryList.splice(0, 0, all);
                    this.getProduct();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        selectCategory(data) {
            console.log('selectCategory => ', data);
            this.selectedCategory = data.id;
            this.getProduct();
        },
        selectProduct(data) {
            // console.log('selectProduct => ', data);
            const tempOrder = {
                orderCode: '',
                product: data.id,
                product_name: data.product_name,
                status: 'ordered',
                customer: 1,
                quantity: 1,
                price: data.price,
                remarks: '',
            };
            const tempOrderList = this.orderList;
            const index = tempOrderList.findIndex(item => item.product == data.id);
            // console.log('order index =>', index);
            if (index != -1) {
                tempOrder.quantity = tempOrderList[index].quantity + 1;
                tempOrderList[index] = tempOrder;
            } else {
                tempOrderList.push(tempOrder);
            }
            this.orderList = [];
            this.orderList = tempOrderList;
            // console.log('orderList => ', this.orderList)
            this.totalQuantity = 0;
            this.totalAmount = 0;
            for (var item of this.orderList) {
                console.log('orderItem => ', item);
                this.totalQuantity += item.quantity;
                this.totalAmount += item.quantity * item.price;
            }
        },
        clearOrder() {
            this.orderList = [];
            this.totalQuantity = 0;
            this.totalAmount = 0;
        },
        async getProduct() {
            const response = await http.get(`/products/shop/${this.selectedCategory}`);
            console.log('product response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    const resData = response.data.data;
                    this.productList = this.listToMatrix(resData, 6);
                    console.log('ddd==>', this.productList);
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        listToMatrix(list, elementPerSubArray) {
            var matrix = [], i, k;
            for (i = 0, k = -1; i < list.length; i++) {
                if (i % elementPerSubArray === 0) {
                    k++;
                    matrix[k] = [];
                }
                matrix[k].push(list[i]);
            }
            return matrix;
        }
        // handleDownload() {
        //     try {
        //         this.downloadLoading = true;
        //         const tHeader = ['Brand Name', 'Created At', 'Updated At', 'Remarks']
        //         const tBody = [];
        //         for (const i in this.brandData) {
        //             let item = this.brandData[i];
        //             let data = [
        //                 item.brand_name,
        //                 this.formattedDate(item.created_at),
        //                 this.formattedDate(item.updated_at),
        //                 item.remarks
        //             ];
        //             tBody.push(data);
        //         }
        //         const now = new Date();
        //         const fileName = 'BrandData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
        //         import('@/vendor/Export2Excel').then(excel => {
        //             excel.export_json_to_excel({
        //                 header: tHeader,
        //                 data: tBody,
        //                 filename: fileName,
        //                 autoWidth: true,
        //                 bookType: 'xlsx'
        //             })
        //             this.downloadLoading = false
        //         })
        //     } catch (erorr) {
        //         console.log('Download => ', error);
        //     }
        // },
        // formattedDate(date) {
        //     return moment(date).format('DD-MM-YYYY')
        // },
        // handleSwitchAndSearch() {
        //     this.resetPagination();
        //     this.getData();
        // },
        // resetPagination() {
        //     this.pageIndex = 1;
        //     this.pageSize = 10;
        // },
        // updateBrand(data) {
        //     console.log('updateBrand=>', data)
        //     this.brandForm.brand_name = data.brand_name;
        //     this.brandForm.remarks = data.remarks;
        //     this.brand_id = data.id;
        //     this.isUpdate = true;
        // },
        // onSubmit() {
        //     this.$refs.brandForm.validate((valid) => {
        //         if (valid) {
        //             console.log('brandForm=>>', this.brandForm);
        //             this.submitUpdate();
        //         } else {
        //             console.log('error onSubmit!!');
        //             return false;
        //         }
        //     });
        // },
        // async submitUpdate() {
        //     const response = await http.patch(`/brands/${this.brand_id}`, this.brandForm);
        //     console.log('updateBrand response =>', response);
        //     if (response != null) {
        //         if (response.status == 200) {
        //             this.$message.success(`Success: ${response.statusText}`);
        //             this.getData();
        //             this.resetUpdate();
        //         } else {
        //             this.$message.error(`${getErrorMessage(response)}`);
        //         }
        //     }
        // },
        // resetUpdate() {
        //     this.brand_id = 0;
        //     this.brandForm.brand_name = '';
        //     this.brandForm.remarks = '';
        //     this.isUpdate = false;
        // },
        // deleteBrand(data) {
        //     this.brand_id = data.id;
        //     this.showDeleteDialog = true
        // },
        // async confirmDelete(remarks) {
        //     // console.log('remarks=>', remarks)
        //     const response = await http.delete(`/brands/${this.brand_id}`)
        //     console.log('brand delete response => ', response)
        //     if (response.status == 200) {
        //         this.showDeleteDialog = false;
        //         this.brand_id = 0;
        //         this.$message.success(`Success: ${response.statusText}`);
        //         this.getData();
        //     } else {
        //         this.messageAlert = {
        //             title: getErrorMessage(response),
        //             isSuccess: false,
        //             isShow: true
        //         }
        //     }
        // },
        // handlePageSizeChange(size) {
        //     this.pageSize = size;
        //     this.pageIndex = 1;
        //     this.getData();
        // },
        // handlePageIndexChange(index) {
        //     this.pageIndex = index;
        //     this.getData();
        // },
        // closeAlert(){
        //     console.log('close alert')
        //     this.messageAlert.isShow = false;
        // }
    },
    watch: {},
    computed: {},
    filters: {
        // moment: function (date) {
        //     return moment(date).format('DD-MM-YYYY')
        // }
    }
}
