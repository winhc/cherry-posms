import * as http from '@/utils/http'
import moment from 'moment'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'

export const ListOrder = {
    components: { },
    props: {},
    data() {
        return {
            orderData: [],
            pickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() > new Date().getTime();
                }
            },
            searchForm: {
                dateData: [currentDate(), currentDate()],
                order_code: '',
                isAll: true
            },
            isDetail: false,
            pageSize: 10,
            pageIndex: 1,
            tableDataCount: 0,
            tableLoading: false,
            downloadLoading: false,
        }
    },
    mounted() { },
    created() {
        this.getData();
    },
    destroyed() { },
    methods: {
        async getData() {
            this.tableLoading = true;
            console.log('searchForm', this.searchForm);
            const from_date = this.searchForm.dateData[0];
            const to_date = this.searchForm.dateData[1];
            let url = '';
            if (this.searchForm.isAll) {
                url = '/orders?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&order_code=' + this.searchForm.order_code
            } else {
                url = '/orders?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&order_code=' + this.searchForm.order_code
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('order list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.orderData = response.data.data
                    this.tableDataCount = response.data.count
                    console.log('orderData => ', this.orderData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        handleDownload() {
            // try {
            //     this.downloadLoading = true;
            //     const tHeader = ['Brand Name', 'Created At', 'Updated At', 'Remarks']
            //     const tBody = [];
            //     for (const i in this.orderData) {
            //         let item = this.orderData[i];
            //         let data = [
            //             item.order_code,
            //             this.formattedDate(item.created_at),
            //             this.formattedDate(item.updated_at),
            //             item.remarks
            //         ];
            //         tBody.push(data);
            //     }
            //     const now = new Date();
            //     const fileName = 'BrandData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
            //     import('@/vendor/Export2Excel').then(excel => {
            //         excel.export_json_to_excel({
            //             header: tHeader,
            //             data: tBody,
            //             filename: fileName,
            //             autoWidth: true,
            //             bookType: 'xlsx'
            //         })
            //         this.downloadLoading = false
            //     })
            // } catch (erorr) {
            //     console.log('Download => ', error);
            // }
        },
        formattedDate(date) {
            return moment(date).format('DD-MM-YYYY')
        },
        handleSwitchAndSearch() {
            this.resetPagination();
            this.getData();
        },
        resetPagination() {
            this.pageIndex = 1;
            this.pageSize = 10;
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.pageIndex = 1;
            this.getData();
        },
        handlePageIndexChange(index) {
            this.pageIndex = index;
            this.getData();
        }
    },
    watch: {},
    computed: {},
    filters: {
        moment: function (date) {
            return moment(date).format('DD-MM-YYYY')
        }
    }
}
