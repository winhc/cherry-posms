import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddUserType = {
    components: {},
    props: {},
    data() {
        return {
            userTypeForm: {
                user_role: '',
                remarks: ''
            },
            rules: {
                user_role: [
                    { required: true, message: 'Enter user role', trigger: 'blur' }
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
            this.$refs.userTypeForm.validate((valid) => {
                if (valid) {
                    this.createUserType();
                } else {
                    return false;
                }
            });
        },
        async createUserType() {
            const response = await http.post('/user-types', this.userTypeForm);
            console.log('createUserType response =>', response);
            if (response != null) {
                if (response.status == 201) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.resetUserType();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        resetUserType() {
            this.userTypeForm.user_role = '';
            this.userTypeForm.remarks = ''
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
