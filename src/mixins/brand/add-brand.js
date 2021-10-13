import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddBrand = {
    components: {},
    props: {},
    data() {
        return {
            brandForm: {
                brand_name: '',
                remarks: ''
            },
            rules: {
                brand_name: [
                    { required: true, message: 'Enter brand name', trigger: 'blur' }
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
            this.$refs.brandForm.validate((valid) => {
                if (valid) {
                    this.createBrand();
                } else {
                    return false;
                }
            });
        },
        async createBrand() {
            const response = await http.post('/brands', this.brandForm);
            console.log('createBrand response =>', response);
            if (response != null) {
                if (response.status == 201) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.resetBrandForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        resetBrandForm() {
            this.brandForm.brand_name = '';
            this.remarks = ''
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
