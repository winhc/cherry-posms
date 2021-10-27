import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddStore = {
    components: {},
    props: {},
    data() {
        return {
            storeForm: {
                store_name: '',
                address: '',
                remarks: ''
            },
            rules: {
                store_name: [
                    { required: true, message: 'Enter store name', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: 'Enter address', trigger: 'blur' }
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
            this.$refs.storeForm.validate((valid) => {
                if (valid) {
                    this.createStore();
                } else {
                    return false;
                }
            });
        },
        async createStore() {
            const response = await http.post('/stores', this.storeForm);
            console.log('createStore response =>', response);
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
            this.storeForm = {
                store_name: '',
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
