import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '@/components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'

export const ListInventory = {
    components: { DeleteDialog },
    props: {},
    data() {
        return {
            currentTab: 'Warehouse',
            warehouseProductData: [],
            storeProductData: [],
            storeData: [],
            tableDataCount: 0,
            tableLoading: false,
            tabList: [
                {
                    title: 'Warehouse'
                }
            ],
        }
    },
    mounted() { },
    created() {
        this.getData();
    },
    destroyed() { },
    methods: {
        handleTabClick(tab, event) {
            console.log(this.currentTab);
        },
        async getData() {
            this.tableLoading = true;
            // console.log('searchForm', this.searchForm);
            // const from_date = this.searchForm.dateData[0];
            // const to_date = this.searchForm.dateData[1];
            let url = '/inventories';
            // if (this.searchForm.isAll) {
            //     url = '/brands?page_size=' + this.pageSize
            //         + '&page_index=' + this.pageIndex
            //         + '&brand_name=' + this.searchForm.brand_name
            // } else {
            //     url = '/brands?page_size=' + this.pageSize
            //         + '&page_index=' + this.pageIndex
            //         + '&brand_name=' + this.searchForm.brand_name
            //         + '&from_date=' + from_date
            //         + '&to_date=' + to_date
            // }
            const response = await http.get(url);
            console.log('inventory list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.warehouseProductData = response.data.product.data;
                    this.storeData = response.data.store.data;
                    var obj = {};
                    for(const i in this.storeData){
                        const item = this.storeData[i];
                        obj.title = item.store_name;
                        this.storeProductData = this.storeData[i].store_products;
                    }
                    this.tabList.push(obj);
                    console.log('warehouseProductData => ', this.warehouseProductData)
                    console.log('storeData => ', this.storeData)
                    console.log('storeProductData => ', this.storeProductData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
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
