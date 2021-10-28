import * as http from '@/utils/http'
import * as moment from 'moment'
import DeleteDialog from '@/components/DeleteDialog/'
import UploadImage from '@/components/UploadImage/';
import { getErrorMessage } from '@/utils/message-tip';
import { currentDate } from '@/utils/date-format';
export const ListProduct = {
    components: { DeleteDialog, UploadImage },
    props: {},
    data() {
        const validateBarCode = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter or scan bar code`))
            } else if (value.length < 13) {
                callback(new Error(`Bar code must have 13 digits`))
            } else if (value.length > 13) {
                callback(new Error(`Bar code can't greater than 13 digits`))
            } else {
                callback()
            }
        }
        const validateCost = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter buy unit price`))
            } else if (value <= 0) {
                callback(new Error('Buy unit price must greater than 0'))
            } else {
                callback()
            }
        }
        const validatePrice = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter price`))
            } else if (value <= 0) {
                callback(new Error('Price must greater than 0'))
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
            showDeleteDialog: false,
            product_id: 0,
            supplier_product_id: 0,
            avatar_url: process.env.VUE_APP_PRODUCT_AVATAR_API,
            isUpdate: false,
            productForm: {
                bar_code: '',
                product_name: '',
                image: '',
                category: null,
                brand: null,
                product_type: null,
                supplier: null,
                quantity: null,
                cost: null,
                alert_quantity: null,
                price: null,
                tax: null,
                store: null,
                remarks: ''
            },
            rules: {
                bar_code: [
                    { required: true, trigger: 'blur', validator: validateBarCode },
                ],
                product_name: [
                    { required: true, message: 'Enter product name', trigger: 'blur' },
                ],
                category: [
                    { required: true, message: 'Select category', trigger: 'blur' },
                ],
                product_type: [
                    { required: true, message: 'Select unit', trigger: 'blur' },
                ],
                brand: [
                    { required: true, message: 'Select brand', trigger: 'blur' },
                ],
                supplier: [
                    { required: true, message: 'Select supplier', trigger: 'blur' },
                ],
                store: [
                    { required: true, message: 'Select store', trigger: 'blur' },
                ],
                cost: [
                    { required: true, trigger: 'blur', validator: validateCost },
                ],
                quantity: [
                    { required: true, trigger: 'blur', validator: validateQuantity },
                ],
                alert_quantity: [
                    { required: true, validator: validateAlertQuantity, trigger: 'blur' },
                ],
                price: [
                    { required: true, trigger: 'blur', validator: validatePrice },
                ]
            },
            imageUrl: '',
            imageFile: null,
            isResetImage: false,
            rangeDatePickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() > new Date().getTime();
                }
            },
            singleDatePickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() < new Date().getTime();
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
            categoryList: [],
            brandList: [],
            productTypeList: [],
            supplierList: [],
            storeList: [],
            isImport: false,
            isExport: false
        }
    },
    mounted() { },
    created() {
        this.getData()
        console.log('dateData=>', this.searchForm.dateData);
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
                url = '/products?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&product_name=' + this.searchForm.product_name
            } else {
                url = '/products?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&product_name=' + this.searchForm.product_name
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('product list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.productData = response.data.data
                    this.tableDataCount = response.data.count
                    this.getProductOption();
                    console.log('productData => ', this.productData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        async getProductOption() {
            const response = await http.get('/products/product-options');
            console.log('product option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.brandList = response.data.brand.data;
                    this.categoryList = response.data.category.data;
                    this.productTypeList = response.data.product_type.data;
                    this.supplierList = response.data.supplier.data;
                    this.storeList = response.data.store.data;
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
            console.log('updateProduct=>', data)
            this.productForm.bar_code = data.bar_code;
            this.productForm.product_name = data.product_name;
            this.productForm.category = data.category.id;
            this.productForm.brand = data.brand.id;
            for (const item of data.supplier_product) {
                this.supplier_product_id = item.id;
                this.productForm.product_type = item.product_type.id;
                this.productForm.supplier = item.supplier.id;
                this.productForm.expiry_at = item.expiry_at;
            }
            this.productForm.quantity = data.quantity;
            this.productForm.alert_quantity = data.alert_quantity;
            this.productForm.cost = data.cost;

            this.productForm.remarks = data.remarks;
            this.productForm.image = data.image;
            this.imageUrl = '';
            if (data.image) {
                this.imageUrl = this.avatar_url + data.id + '/' + data.image;
                console.log(`imageUrl => ${this.imageUrl}`);
            }
            this.product_id = data.id;
            this.isUpdate = true;
        },
        handleUploadChange(file) {
            console.log('handleUploadChange view==>', file);
            if (file) {
                this.imageFile = file.raw;
                this.imageUrl = this.imageUrl = URL.createObjectURL(file.raw);
                this.isResetImage = false;
            }
        },
        deleteImage(file) {
            console.log('deleteImage view==>', file);
            this.imageFile = file;
            this.productForm.image = '';
        },
        onSubmit() {
            this.$refs.productForm.validate((valid) => {
                if (valid) {
                    console.log('imageUrl=>>', this.imageUrl);
                    console.log('imageFile=>>', this.imageFile);
                    console.log('productForm=>>', this.productForm);
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            let formData = new FormData(); // important for image file upload
            formData.append('bar_code', this.productForm.bar_code);
            formData.append('product_name', this.productForm.product_name);
            formData.append('category', this.productForm.category);
            formData.append('brand', this.productForm.brand);
            formData.append('supplier', this.productForm.supplier);
            formData.append('product_type', this.productForm.product_type);
            formData.append('quantity', this.productForm.quantity);
            formData.append('cost', this.productForm.cost);
            formData.append('alert_quantity', this.productForm.alert_quantity);
            formData.append('expiry_at', this.productForm.expiry_at);
            formData.append('remarks', this.productForm.remarks);
            if (this.imageUrl == '') {
                formData.append('image', '');
            } else {
                formData.append('image', this.imageFile || this.productForm.image);
            }
            const response = await http.put(`/products/${this.product_id}/${this.supplier_product_id}`, formData);
            console.log('updateProduct response =>', response);
            if (response != null) {
                if (response.status == 200) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.getData();
                    this.resetForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        resetForm() {
            this.productForm = {
                bar_code: '',
                product_name: '',
                image: '',
                category: null,
                product_type: null,
                brand: null,
                cost: null,
                quantity: null,
                alert_quantity: null,
                supplier: null,
                expiry_at: '',
                remarks: ''
            }
            this.imageUrl = '';
            this.imageFile = null;
            this.isUpdate = false;
            this.isResetImage = true;
            this.isUpdate = false;
            this.isImport = false;
            this.isExport = false;
        },
        importProduct(data) {
            console.log(`import => ${JSON.stringify(data)}`)
            this.productForm.bar_code = data.bar_code;
            this.productForm.product_name = data.product_name;
            this.productForm.category = data.category.id;
            this.productForm.brand = data.brand.id;
            this.product_id = data.id;
            this.isImport = true;
        },
        onImportSubmit() {
            this.$refs.productForm.validate((valid) => {
                if (valid) {
                    this.submitImport();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitImport() {
            console.log('import productForm ==>', JSON.stringify(this.productForm))
            const response = await http.patch(`/products/import/${this.product_id}`, this.productForm);
            console.log('updateProduct response =>', response);
            if (response != null) {
                if (response.status == 200) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.getData();
                    this.resetForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        exportProduct(data) {
            console.log(`export => ${JSON.stringify(data)}`)
            this.productForm.product_name = data.product_name;
            this.productForm.cost = data.cost;
            this.product_id = data.id;
            this.isExport = true;
        },
        onExportSubmit() {
            this.$refs.productForm.validate((valid) => {
                if (valid) {
                    this.submitExport();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitExport() {
            console.log('export productForm ==>', JSON.stringify(this.productForm))
            const response = await http.patch(`/products/export/${this.product_id}`, this.productForm);
            console.log('updateProduct response =>', response);
            if (response != null) {
                if (response.status == 200) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.getData();
                    this.resetForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        deleteProduct(data) {
            this.product_id = data.id;
            this.showDeleteDialog = true
        },
        async confirmDelete(remarks) {
            // console.log('remarks=>', remarks)
            const response = await http.delete(`/products/${this.product_id}`)
            console.log('product delete response => ', response)
            if (response.status == 200) {
                this.showDeleteDialog = false;
                this.product_id = 0;
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
