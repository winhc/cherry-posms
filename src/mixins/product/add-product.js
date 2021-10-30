import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';
import UploadImage from '@/components/UploadImage/';
import * as CodeGenerator from '@/utils/code-generator';

export const AddProduct = {
    components: { UploadImage },
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
            productForm: {
                product_code: CodeGenerator.getCode({ prefix: 'P', length: 5 }),
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
                // bar_code: [
                //     { required: true, validator: validateBarCode, trigger: 'blur' },
                // ],
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
            imageFile: null,
            isResetImage: false,
            categoryList: [],
            brandList: [],
            productTypeList: [],
            pickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() < new Date().getTime();
                }
            },
            singleDatePickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() < new Date().getTime();
                }
            },
        };
    },
    mounted() {
        if (this.productForm.product_name === '') {
            this.$refs.product_name.focus()
        }
    },
    created() {
        this.getProductOption();
    },
    destroyed() { },
    methods: {
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
        onSubmit() {
            this.$refs.productForm.validate((valid) => {
                if (valid) {
                    this.createProduct();
                } else {
                    return false;
                }
            });
        },
        async createProduct() {
            console.log('productForm', this.productForm)
            let formData = new FormData(); // important for image file upload
            formData.append('product_code', this.productForm.product_code);
            formData.append('bar_code', this.productForm.bar_code);
            formData.append('product_name', this.productForm.product_name);
            formData.append('category', this.productForm.category);
            formData.append('brand', this.productForm.brand);
            formData.append('product_type', this.productForm.product_type);
            formData.append('quantity', this.productForm.quantity);
            formData.append('cost', this.productForm.cost);
            formData.append('price', this.productForm.price);
            formData.append('alert_quantity', this.productForm.alert_quantity);
            formData.append('expiry_at', this.productForm.expiry_at);
            formData.append('remarks', this.productForm.remarks);
            formData.append('image', this.imageFile);
            const response = await http.post('/products', formData);
            console.log('createProduct response =>', response);
            if (response != '') {
                if (response.status == 201) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.resetForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        deleteImage(file) {
            // console.log('deleteImage view==>', file);
            this.imageFile = file;
        },
        handleUploadChange(file) {
            // console.log('handleUploadChange view==>', file);
            if (file) {
                this.imageFile = file.raw;
                this.isResetImage = false;
            }
        },
        resetForm() {
            this.productForm = {
                product_code: CodeGenerator.getCode({ prefix: 'P', length: 5 }),
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
            }
            this.imageFile = null;
            this.isResetImage = true;
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
