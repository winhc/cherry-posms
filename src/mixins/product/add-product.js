import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';
import UploadImage from '../../components/UploadImage/';
import * as CodeGenerator from '@/utils/code-generator';

export const AddProduct = {
    components: { UploadImage },
    props: {},
    data() {
        const validateBuyUnitPrice = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter buy unit price`))
            } else if (value <= 0) {
                callback(new Error('Buy unit price must greater than 0'))
            } else {
                callback()
            }
        }
        const validateSellUnitPrice = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter sell unit price`))
            } else if (value <= 0) {
                callback(new Error('Sell unit price must greater than 0'))
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
        return {
            productForm: {
                product_code: CodeGenerator.getCode({ prefix: 'P', length: 5 }),
                product_name: '',
                category: null,
                product_type: null,
                brand: null,
                supplier: null,
                buy_unit_price: null,
                sell_unit_price: null,
                expiry_at: '',
                tax: null,
                quantity: null,
                alert_quantity: null,
                for_sale: false,
                remarks: ''
            },
            rules: {
                product_name: [
                    { required: true, message: 'Enter product name', trigger: 'blur' },
                ],
                category: [
                    { required: true, message: 'Select category', trigger: 'blur' },
                ],
                product_type: [
                    { required: true, message: 'Select product type', trigger: 'blur' },
                ],
                brand: [
                    { required: true, message: 'Select brand', trigger: 'blur' },
                ],
                supplier: [
                    { required: true, message: 'Select supplier', trigger: 'blur' },
                ],
                buy_unit_price: [
                    { required: true, trigger: 'blur', validator: validateBuyUnitPrice },
                ],
                sell_unit_price: [
                    { required: true, trigger: 'blur', validator: validateSellUnitPrice },
                ],
                tax: [
                    { required: true, trigger: 'blur', message: 'Enter tax', },
                ],
                quantity: [
                    { required: true, trigger: 'blur', validator: validateQuantity },
                ],
                alert_quantity: [
                    { required: true, trigger: 'blur', message: 'Enter alert quantity', },
                ],
            },
            imageFile: null,
            isResetImage: false,
            categoryList: [],
            productTypeList: [],
            brandList: [],
            supplierList: [],
            pickerOptions: {
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
                    this.supplierList = response.data.supplier.data;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        async createProduct() {
            console.log('productForm', this.productForm)
            let formData = new FormData(); // important for image file upload
            formData.append('product_code', this.productForm.product_code);
            formData.append('product_name', this.productForm.product_name);
            formData.append('category', this.productForm.category);
            formData.append('product_type', this.productForm.product_type);
            formData.append('brand', this.productForm.brand);
            formData.append('supplier', this.productForm.supplier);
            formData.append('buy_unit_price', this.productForm.buy_unit_price);
            formData.append('sell_unit_price', this.productForm.sell_unit_price);
            formData.append('expiry_at', this.productForm.expiry_at);
            formData.append('tax', this.productForm.tax);
            formData.append('quantity', this.productForm.quantity);
            formData.append('alert_quantity', this.productForm.alert_quantity);
            formData.append('for_sale', this.productForm.for_sale);
            formData.append('remarks', this.productForm.remarks);
            formData.append('image', this.imageFile);
            const response = await http.post('/products', formData);
            console.log('createProduct response =>', response);
            if (response != null) {
                if (response.status == 201) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.resetForm();
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
                product_name: '',
                category: null,
                product_type: null,
                brand: null,
                buy_unit_price: null,
                sell_unit_price: null,
                expiry_at: '',
                tax: null,
                quantity: null,
                alert_quantity: null,
                for_sale: false,
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
