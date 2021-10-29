import * as http from '@/utils/http'
import { getErrorMessage } from '@/utils/message-tip';
export const ExportProduct = {
    components: {},
    props: {},
    data() {
        const validatePrice = (rule, value, callback) => {
            if (value == null) {
                callback(new Error(`Enter unit price`))
            } else if (value <= 0) {
                callback(new Error('Unit price must greater than 0'))
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
            product_id: 0,
            productForm: {
                product: null,
                bar_code: '',
                category: '',
                brand: '',
                product_type: null,
                store: null,
                quantity: null,
                price: null,
                alert_quantity: null,
                tax: null,
                remarks: ''
            },
            rules: {
                product_type: [
                    { required: true, message: 'Select unit', trigger: 'blur' },
                ],
                store: [
                    { required: true, message: 'Select store', trigger: 'blur' },
                ],
                price: [
                    { required: true, trigger: 'blur', validator: validatePrice },
                ],
                quantity: [
                    { required: true, trigger: 'blur', validator: validateQuantity },
                ],
                alert_quantity: [
                    { required: true, validator: validateAlertQuantity, trigger: 'blur' },
                ]
            },
            productList: [],
            productTypeList: [],
            storeList: [],
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
            const response = await http.get('/warehouses/export-options');
            console.log('product option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.productList = response.data.product.data;
                    this.productTypeList = response.data.product_type.data;
                    this.storeList = response.data.store.data;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        selectProduct(index) {
            console.log('selected_product_name => ', this.productForm.product_name);
            console.log('selected_product => ', this.productList[index]);
            this.productForm.bar_code = this.productList[index].bar_code;
            this.productForm.category = this.productList[index].category.category_name;
            this.productForm.brand = this.productList[index].brand.brand_name;
            this.product_id = this.productList[index].id;
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
            const { product_type, store, quantity, price, alert_quantity, tax, remarks } = this.productForm;
            const exportProductData = { product_type, store, quantity, price, alert_quantity, tax, remarks };
            console.log('exportProductData ==>', JSON.stringify(exportProductData))
            const response = await http.patch(`/warehouses/export/${this.product_id}`, exportProductData);
            console.log('exportProduct response =>', response);
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
                product: null,
                bar_code: '',
                category: '',
                brand: '',
                product_type: null,
                store: null,
                quantity: null,
                price: null,
                alert_quantity: null,
                tax: null,
                remarks: ''
            }
        },
    },
    watch: {},
    computed: {},
    filters: {
    }
}
