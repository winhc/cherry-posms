import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddSupplier = {
    components: {},
    props: {},
    data() {
        const validatePhoneNumber = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter phone number`))
            }
            else if (value.length < 9) {
                callback(new Error(`Phone number can't be less than 9 digit`))
            } else if (value.length > 9) {
                callback(new Error(`Phone number can't be greater than 9 digit`))
            } else {
                callback()
            }
        }
        return {
            supplierForm: {
                supplier_name: '',
                phone: '',
                address: '',
                remarks: ''
            },
            rules: {
                supplier_name: [
                    { required: true, message: 'Enter supplier name', trigger: 'blur' }
                ],
                phone: [
                    { required: true, trigger: 'blur', validator: validatePhoneNumber }
                ],
                address: [
                    { required: true, message: 'Enter address', trigger: 'blur' }
                ],
            }
        };
    },
    mounted() {
        if (this.supplierForm.supplier_name === '') {
            this.$refs.supplier_name.focus()
        }
    },
    created() {
    },
    destroyed() { },
    methods: {
        onSubmit() {
            this.$refs.supplierForm.validate((valid) => {
                if (valid) {
                    this.createSupplier();
                } else {
                    return false;
                }
            });
        },
        async createSupplier() {
            const response = await http.post('/suppliers', this.supplierForm);
            console.log('createSupplier response =>', response);
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
            this.supplierForm = {
                supplier_name: '',
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
