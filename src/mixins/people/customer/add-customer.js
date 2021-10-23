import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddCustomer = {
    components: {},
    props: {},
    data() {
        // const validatePhoneNumber = (rule, value, callback) => {
        //     if (this.customerForm.phone != '') {
        //         if (value.length < 9) {
        //             callback(new Error(`Phone number can't be less than 9 digit`))
        //         } else if (value.length > 9) {
        //             callback(new Error(`Phone number can't be greater than 9 digit`))
        //         } else {
        //             callback()
        //         }
        //     }
        // }
        return {
            customerForm: {
                customer_name: '',
                phone: '',
                address: '',
                remarks: ''
            },
            rules: {
                customer_name: [
                    { required: true, message: 'Enter customer name', trigger: 'blur' }
                ],
                // phone: [
                //     { required: true, trigger: 'blur', validator: validatePhoneNumber }
                // ],
            }
        };
    },
    mounted() {
        if (this.customerForm.customer_name === '') {
            this.$refs.customer_name.focus()
        }
    },
    created() {
    },
    destroyed() { },
    methods: {
        onSubmit() {
            this.$refs.customerForm.validate((valid) => {
                if (valid) {
                    this.createCustomer();
                } else {
                    return false;
                }
            });
        },
        async createCustomer() {
            const response = await http.post('/customers', this.customerForm);
            console.log('createCustomer response =>', response);
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
            this.customerForm = {
                customer_name: '',
                phone: '',
                address: '',
                remarks: ''
            }
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
