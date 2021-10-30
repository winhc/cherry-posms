import * as http from '@/utils/http'
import { getErrorMessage } from '@/utils/message-tip';
export const ImportProduct = {
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
            productForm: {
                product: 0,
                product_data: null,
                bar_code: '',
                category: '',
                brand: '',
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
            selectedProduct: null,
        }
    },
    mounted() { },
    created() {
        this.getData()
    },
    destroyed() { },
    methods: {
        async getData() {
            const response = await http.get('/warehouses/import-options');
            console.log('product option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.productList = response.data.product.data;
                    this.productTypeList = response.data.product_type.data;
                    this.supplierList = response.data.supplier.data;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        selectProduct(index) {
            console.log('selected_product_name => ', this.productForm.product_name);
            console.log('selected_product => ', this.productList[index]);
            this.productForm.bar_code = this.productList[index].bar_code ? this.productList[index].bar_code : '';
            this.productForm.category = this.productList[index].category.category_name;
            this.productForm.brand = this.productList[index].brand.brand_name;
            this.productForm.product = this.productList[index].id;
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
            const { product,bar_code, product_type, supplier, quantity, cost, alert_quantity, expiry_at, remarks } = this.productForm;
            const importProductData = { bar_code, product, product_type, supplier, quantity, cost, alert_quantity, expiry_at, remarks };
            console.log('importProductData ==>', JSON.stringify(importProductData))
            const response = await http.post(`/warehouses/import-product`, importProductData);
            console.log('importProduct response =>', response);
            if (response != null) {
                if (response.status == 201) {
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
                product: null,
                bar_code: '',
                category: '',
                brand: '',
                product_type: null,
                cost: null,
                quantity: null,
                alert_quantity: null,
                supplier: null,
                expiry_at: '',
                remarks: ''
            }
        },
    },
    watch: {},
    computed: {},
    filters: {
    }
}
