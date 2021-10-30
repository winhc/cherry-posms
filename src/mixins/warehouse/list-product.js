import * as http from '@/utils/http'
import * as moment from 'moment'
import { getErrorMessage } from '@/utils/message-tip';
import { currentDate } from '@/utils/date-format';
export const ListProduct = {
    components: {},
    props: {},
    data() {
        const validateBarCode = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter bar code`))
            } else if (value.length < 13) {
                callback(new Error(`Bar code can't less than 13 digits`))
            } else if (value.length > 13) {
                callback(new Error(`Bar code can't greater than 13 digits`))
            } else {
                callback()
            }
        }
        const validateCost = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter unit cost`))
            } else if (value <= 0) {
                callback(new Error('Unit cost must greater than 0'))
            } else {
                callback()
            }
        }
        const validateQuantity = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter quantity`))
            } else if (value <= 0) {
                callback(new Error('Quantity must greater than 0'))
            } else {
                callback()
            }
        }
        const validateAlertQuantity = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter alert quantity`))
            } else if (value <= 0) {
                callback(new Error('Alert quantity must greater than 0'))
            } else {
                callback()
            }
        }
        return {
            productData: [],
            product_id: 0,
            supplier_product_id: 0,
            isUpdate: false,
            productForm: {
                bar_code: '',
                product_type: null,
                supplier: null,
                quantity: null,
                cost: null,
                alert_quantity: null,
                expiry_at: '',
                remarks: ''
            },
            rules: {
                bar_code: [
                    { required: true, trigger: 'blur', validation: validateBarCode },
                ],
                product_type: [
                    { required: true, message: 'Select unit', trigger: 'blur' },
                ],
                supplier: [
                    { required: true, message: 'Select supplier', trigger: 'blur' },
                ],
                cost: [
                    { required: true, trigger: 'blur', validator: validateCost },
                ],
                quantity: [
                    { required: true, trigger: 'blur', validator: validateQuantity },
                ],
                alert_quantity: [
                    { required: true, validator: validateAlertQuantity, trigger: 'blur' },
                ]
            },
            singleDatePickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() < new Date().getTime();
                }
            },
            productList: [],
            productTypeList: [],
            supplierList: [],
            rangeDatePickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() > new Date().getTime();
                }
            },
            searchForm: {
                dateData: [currentDate(), currentDate()],
                product_name: '',
                isAll: true
            },
            pageSize: 10,
            pageIndex: 1,
            tableDataCount: 0,
            tableLoading: false,
            downloadLoading: false,
        }
    },
    mounted() { },
    created() {
        this.getData()
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
                url = '/warehouses?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&product_name=' + this.searchForm.product_name
            } else {
                url = '/warehouses?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&product_name=' + this.searchForm.product_name
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('product list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.productData = response.data.data;
                    this.tableDataCount = response.data.count;
                    this.getProductOption();
                    console.log('productData => ', this.productData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        async getProductOption() {
            const response = await http.get('/warehouses/import-options');
            console.log('product option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.supplierList = response.data.supplier.data;
                    this.productTypeList = response.data.product_type.data;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        handleDownload() {
            try {
                this.downloadLoading = true;
                const tHeader = ['Product Name', 'Product Code', 'Created At', 'Updated At', 'Remarks']
                const tBody = [];
                for (const i in this.productData) {
                    let item = this.productData[i];
                    let data = [
                        item.product_name,
                        item.product_code,
                        this.formattedDate(item.created_at),
                        this.formattedDate(item.updated_at),
                        item.remarks
                    ];
                    tBody.push(data);
                }
                const now = new Date();
                const fileName = 'ProductData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
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
        updateProduct(data) {
            this.productForm.bar_code = data.product.bar_code;
            this.productForm.supplier = data.supplier.id;
            this.productForm.quantity = data.quantity;
            this.productForm.product_type = data.product_type.id;
            this.productForm.cost = data.cost;
            this.productForm.alert_quantity = data.alert_quantity;
            this.productForm.expiry_at = data.expiry_at;
            this.productForm.remarks = data.remarks;
            this.isUpdate = true;
        },
        onSubmit() {
            this.$refs.productForm.validate((valid) => {
                if (valid) {
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            // let formData = new FormData(); // important for image file upload
            // formData.append('product_name', this.productForm.product_name);
            // formData.append('category', this.productForm.category);
            // formData.append('brand', this.productForm.brand);
            // formData.append('remarks', this.productForm.remarks);
            // if (this.imageUrl == '') {
            //     formData.append('image', '');
            // } else {
            //     formData.append('image', this.imageFile || this.productForm.image);
            // }
            // const response = await http.patch(`/products/${this.product_id}/${this.supplier_product_id}`, formData);
            // console.log('updateProduct response =>', response);
            // if (response != null) {
            //     if (response.status == 200) {
            //         this.$message.success(`Success: ${response.statusText}`);
            //         this.getData();
            //         this.resetForm();
            //     } else {
            //         this.$message.error(`${getErrorMessage(response)}`);
            //     }
            // }
        },
        resetForm() {
            this.productForm = {
                bar_code: '',
                product_type: null,
                supplier: null,
                quantity: null,
                cost: null,
                alert_quantity: null,
                expiry_at: '',
                remarks: ''
            }
            this.isUpdate = false;
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
    },
    watch: {},
    computed: {},
    filters: {
        moment: function (date) {
            return moment(date).format('DD-MM-YYYY')
        }
    }
}
