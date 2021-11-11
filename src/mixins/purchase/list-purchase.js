import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '@/components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'

export const ListPurchase = {
    components: { DeleteDialog },
    props: {},
    data() {
        const validateQuantity = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter quantity`))
            } else if (value <= 0) {
                callback(new Error('Quantity must greater than 0'))
            } else {
                callback()
            }
        }
        return {
            purchaseData: [],
            showDeleteDialog: false,
            purchase_id: 0,
            isUpdate: false,
            isDetail: false,
            purchaseForm: {
                supplier: null,
                product: null,
                quantity: null,
                cost: null,
                remarks: ''
            },
            rules: {
                supplier: [
                    { required: true, message: 'Select supplier', trigger: 'blur' }
                ],
                product: [
                    { required: true, message: 'Select product', trigger: 'blur' }
                ],
                quantity: [
                    { required: true, trigger: 'blur', validator: validateQuantity }
                ],
                cost: [
                    { required: true, trigger: 'blur', validator: validateQuantity }
                ],
            },
            productList: [],
            supplierList: [],
            pickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() > new Date().getTime();
                }
            },
            searchForm: {
                dateData: [currentDate(), currentDate()],
                supplier_name: '',
                isAll: true
            },
            pageSize: 10,
            pageIndex: 1,
            tableDataCount: 0,
            tableLoading: false,
            downloadLoading: false,
            messageAlert: {
                title: '',
                isSuccess: true,
                isShow: false,
            }
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
            const from_date = this.searchForm.dateData[0];
            const to_date = this.searchForm.dateData[1];
            let url = '';
            if (this.searchForm.isAll) {
                url = '/purchases?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&supplier_name=' + this.searchForm.supplier_name
            } else {
                url = '/purchases?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&supplier_name=' + this.searchForm.supplier_name
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('brand list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.purchaseData = response.data.data
                    this.tableDataCount = response.data.count
                    console.log('purchaseData => ', this.purchaseData)
                    this.getPurchaseOption();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        async getPurchaseOption() {
            const response = await http.get('/purchases/purchase-options');
            console.log('purchase option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.productList = response.data.product.data;
                    this.supplierList = response.data.supplier.data;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        handleDownload() {
            try {
                this.downloadLoading = true;
                let tHeader = [];
                let tBody = [];
                if (this.isDetail) {
                    tHeader = ['Product', 'Suplier', 'Quantity', 'Total Cost', 'Date', 'Remarks'];
                    tBody = [];
                    for (const i in this.purchaseData) {
                        let item = this.purchaseData[i];
                        let data = [
                            item.product.product_name,
                            item.supplier.supplier_name,
                            item.quantity,
                            item.quantity * item.price,
                            this.formattedDate(item.created_at),
                            item.remarks
                        ];
                        tBody.push(data);
                    }
                } else {
                    tHeader = ['Quantity', 'Total Cost', 'Date'];
                    tBody = [];
                    for (const i in this.purchaseData) {
                        let item = this.purchaseData[i];
                        let data = [
                            item.quantity,
                            item.quantity * item.price,
                            this.formattedDate(item.created_at)
                        ];
                        tBody.push(data);
                    }
                }
                const now = new Date();
                const fileName = 'PurchaseData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
                import('@/vendor/Export2Excel').then(excel => {
                    excel.export_json_to_excel({
                        header: tHeader,
                        data: tBody,
                        filename: fileName,
                        autoWidth: true,
                        bookType: 'xlsx'
                    })
                    this.downloadLoading = false
                })
            } catch (erorr) {
                console.log('Download => ', error);
            }
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
        updatePurchase(data) {
            console.log('updatePurchase=>', data)
            this.purchaseForm.supplier = data.supplier.id;
            this.purchaseForm.product = data.product.id;
            this.purchaseForm.quantity = data.quantity;
            this.purchaseForm.cost = data.cost;
            this.purchaseForm.remarks = data.remarks;
            this.purchase_id = data.id;
            this.isUpdate = true;
        },
        onSubmit() {
            this.$refs.purchaseForm.validate((valid) => {
                if (valid) {
                    console.log('purchaseForm=>>', this.purchaseForm);
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            const response = await http.patch(`/purchases/${this.purchase_id}`, this.purchaseForm);
            console.log('updatePurchase response =>', response);
            if (response != null) {
                if (response.status == 200) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.getData();
                    this.resetUpdate();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        resetUpdate() {
            this.purchaseForm = {
                supplier: null,
                product: null,
                quantity: null,
                cost: null,
                remarks: ''
            }
            this.isUpdate = false;
            this.purchase_id = 0;
        },
        deletePurchase(data) {
            this.purchase_id = data.id;
            this.showDeleteDialog = true
        },
        async confirmDelete(remarks) {
            // console.log('remarks=>', remarks)
            const response = await http.delete(`/purchases/${this.purchase_id}`)
            console.log('purchases delete response => ', response)
            if (response.status == 200) {
                this.showDeleteDialog = false;
                this.purchase_id = 0;
                this.$message.success(`Success: ${response.statusText}`);
                this.getData();
            } else {
                this.messageAlert = {
                    title: getErrorMessage(response),
                    isSuccess: false,
                    isShow: true
                }
            }
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.pageIndex = 1;
            this.getData();
        },
        handlePageIndexChange(index) {
            this.pageIndex = index;
            this.getData();
        },
        closeAlert() {
            console.log('close alert')
            this.messageAlert.isShow = false;
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
