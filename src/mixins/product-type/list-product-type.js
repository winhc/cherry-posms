import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'

export const ListProductType = {
    components: { DeleteDialog },
    props: {},
    data() {
        return {
            productTypeData: [],
            showDeleteDialog: false,
            product_type_id: 0,
            isUpdate: false,
            productTypeForm: {
                product_type_name: '',
                remarks: ''
            },
            rules: {
                product_type_name: [
                    { required: true, message: 'Enter product type name', trigger: 'blur' }
                ],
                remarks: [
                    { required: true, message: 'Enter remarks', trigger: 'blur' }
                ]
            },
            pickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() > new Date().getTime();
                }
            },
            searchForm: {
                dateData: [new Date(), new Date()],
                product_type_name: '',
                isAll: true
            },
            pageSize: 10,
            pageIndex: 1,
            tableDataCount: 0,
            tableLoading: false,
            downloadLoading: false
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
                url = '/product-types?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&product_type_name=' + this.searchForm.product_type_name
            } else {
                url = '/product-types?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&product_type_name=' + this.searchForm.product_type_name
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('product type list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.productTypeData = response.data.data
                    this.tableDataCount = response.data.count
                    console.log('productTypeData => ', this.productTypeData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        handleDownload() {
            try {
                this.downloadLoading = true;
                const tHeader = ['Product Type', 'Created At', 'Updated At', 'Remarks']
                const tBody = [];
                for (const i in this.productTypeData) {
                    let item = this.productTypeData[i];
                    let data = [
                        item.product_type_name,
                        this.formattedDate(item.created_at),
                        this.formattedDate(item.updated_at),
                        item.remarks
                    ];
                    tBody.push(data);
                }
                const now = new Date();
                const fileName = 'ProductTypeData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
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
        updateProductType(data) {
            console.log('updateProduct=>', data)
            this.productTypeForm.product_type_name = data.product_type_name;
            this.productTypeForm.remarks = data.remarks;
            this.product_type_id = data.id;
            this.isUpdate = true;
        },
        onSubmit() {
            this.$refs.productTypeForm.validate((valid) => {
                if (valid) {
                    console.log('productTypeForm=>>', this.productTypeForm);
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            const response = await http.patch(`/product-types/${this.product_type_id}`, this.productTypeForm);
            console.log('updateProductType response =>', response);
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
            this.product_type_id = 0;
            this.productTypeForm.product_type_name = '';
            this.productTypeForm.remarks = '';
            this.isUpdate = false;
        },
        deleteProductType(data) {
            this.product_type_id = data.id;
            this.showDeleteDialog = true
        },
        async confirmDelete(remarks) {
            // console.log('remarks=>', remarks)
            const response = await http.delete(`/product-types/${this.product_type_id}`)
            console.log('product type delete response => ', response)
            if (response.status == 200) {
                this.showDeleteDialog = false;
                this.brand_id = 0;
                this.$message.success(`Success: ${response.statusText}`);
                this.getData();
            } else {
                this.$message.error(`${getErrorMessage(response)}`);
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
