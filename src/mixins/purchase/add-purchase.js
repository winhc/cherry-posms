import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddPurchase = {
    components: {},
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
        };
    },
    mounted() { },
    created() {
        this.getPurchaseOption();
    },
    destroyed() { },
    methods: {
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
        onSubmit() {
            this.$refs.purchaseForm.validate((valid) => {
                if (valid) {
                    this.createPurchase();
                } else {
                    return false;
                }
            });
        },
        async createPurchase() {
            const response = await http.post('/purchases', this.purchaseForm);
            console.log('createPurchase response =>', response);
            if (response != null) {
                if (response.status == 201) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.resetForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        resetForm() {
            this.purchaseForm = {
                supplier: null,
                product: null,
                quantity: null,
                cost: null,
                remarks: ''
            };
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
