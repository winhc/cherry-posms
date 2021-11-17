import * as http from '@/utils/http'
import moment from 'moment'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'
import CountTo from 'vue-count-to'

export const SaleReport = {
    components: { CountTo },
    props: {},
    data() {
        return {
            saleData: [],
            pickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() > new Date().getTime();
                }
            },
            searchForm: {
                dateData: [currentDate(), currentDate()],
                isAll: true,
            },
            pageSize: 10,
            pageIndex: 1,
            tableDataCount: 0,
            tableLoading: false,
            saleValue: 0,
            productCount: 0,
            purchaseValue: 0,
            profitValue: 0,
        }
    },
    mounted() { },
    created() {
        this.getData();
    },
    destroyed() { },
    methods: {
        async getData() {
            this.saleValue = 0;
            this.productCount = 0;
            this.purchaseValue = 0;
            this.profitValue = 0;
            this.tableLoading = true;
            const from_date = this.searchForm.dateData[0];
            const to_date = this.searchForm.dateData[1];
            let url = '';
            if (this.searchForm.isAll) {
                url = '/reports/sale?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
            } else {
                url = '/reports/sale?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('order list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.saleData = response.data.data;
                    this.tableDataCount = response.data.count;
                    console.log('saleData => ', this.saleData);
                    for (var data of this.saleData) {
                        // console.log('ddddd => ', data);
                        this.saleValue += data.sale.total_amount;
                        this.productCount += data.quantity;
                        this.purchaseValue += (data.quantity * data.product.cost);
                    }
                    this.profitValue = this.saleValue - this.purchaseValue;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        handleSwitchAndSearch() {
            this.resetPagination();
            this.getData();
        },
        formattedDate(date) {
            return moment(date).format('DD-MM-YYYY')
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
