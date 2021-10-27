import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddProductType = {
    components: {},
    props: {},
    data() {
        return {
            productTypeForm: {
                unit: '',
                remarks: ''
            },
            rules: {
                unit: [
                    { required: true, message: 'Enter unit', trigger: 'blur' }
                ]
            }
        };
    },
    mounted() { },
    created() {
    },
    destroyed() { },
    methods: {
        onSubmit() {
            this.$refs.productTypeForm.validate((valid) => {
                if (valid) {
                    this.createProductType();
                } else {
                    return false;
                }
            });
        },
        async createProductType() {
            const response = await http.post('/product-types', this.productTypeForm);
            console.log('createProductType response =>', response);
            if (response != null) {
                if (response.status == 201) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.resetProductTypeForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        resetProductTypeForm() {
            this.productTypeForm.unit = '';
            this.productTypeForm.remarks = ''
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
