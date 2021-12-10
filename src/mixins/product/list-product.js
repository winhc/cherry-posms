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
            if (value == '') {
                callback(new Error(`Enter unit cost`))
            } else if (value <= 0) {
                callback(new Error('Unit cost must greater than 0'))
            } else {
                callback()
            }
        }
        const validatePrice = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter unit price`))
            } else if (value <= 0) {
                callback(new Error('Unit price must greater than 0'))
            } else {
                callback()
            }
        }
        const validateQuantity = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter quantity`))
            } else if (value <= 0) {
                callback(new Error('Quantity must greater than 0'))
            } else {
                callback()
            }
        }
        const validateAlertQuantity = (rule, value, callback) => {
            if (value == '') {
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
            avatar_url: process.env.VUE_APP_PRODUCT_AVATAR_API,
            isUpdate: false,
            productForm: {
                bar_code: '',
                product_name: '',
                image: '',
                category: '',
                brand: '',
                product_type: '',
                quantity: '',
                cost: '',
                price: '',
                alert_quantity: '',
                expiry_at: '',
                remarks: ''
            },
            rules: {
                bar_code: [
                    { required: true, validator: validateBarCode, trigger: 'blur' },
                ],
                product_name: [
                    { required: true, message: 'Enter product name', trigger: 'blur' },
                ],
                category: [
                    { required: true, message: 'Select category', trigger: 'blur' },
                ],
                // brand: [
                //     { required: true, message: 'Select brand', trigger: 'blur' },
                // ],
                product_type: [
                    { required: true, message: 'Select brand', trigger: 'blur' },
                ],
                quantity: [
                    { required: true, validator: validateQuantity, trigger: 'blur' },
                ],
                cost: [
                    { required: true, validator: validateCost, trigger: 'blur' },
                ],
                price: [
                    { required: true, validator: validatePrice, trigger: 'blur' },
                ],
                // alert_quantity: [
                //     { required: true, validator: validateAlertQuantity, trigger: 'blur' },
                // ]
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
            this.productForm.brand = data.brand ? data.brand.id : '';
            this.productForm.product_type = data.product_type.id;
            this.productForm.quantity = data.quantity;
            this.productForm.cost = data.cost;
            this.productForm.price = data.price;
            this.productForm.alert_quantity = data.alert_quantity;
            if(data.expiry_at == null){
                this.productForm.expiry_at = '';
            }
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
            formData.append('product_type', this.productForm.product_type);
            formData.append('quantity', this.productForm.quantity);
            formData.append('cost', this.productForm.cost);
            formData.append('price', this.productForm.price);
            formData.append('alert_quantity', this.productForm.alert_quantity);
            if(this.productForm.expiry_at != '') {
                formData.append('expiry_at', this.productForm.expiry_at);
            }
            formData.append('remarks', this.productForm.remarks);
            if (this.imageUrl == '') {
                formData.append('image', '');
            } else {
                formData.append('image', this.imageFile || this.productForm.image);
            }
            console.debug('update productForm =>', this.productForm);
            console.debug('update formData =>', formData);
            const response = await http.patch(`/products/${this.product_id}`, formData);
            console.log('updateProduct response =>', response);
            if (response != '') {
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
                product_name: '',
                image: '',
                category: '',
                brand: '',
                remarks: ''
            }
            this.imageUrl = '';
            this.imageFile = null;
            this.isUpdate = false;
            this.isResetImage = true;
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
