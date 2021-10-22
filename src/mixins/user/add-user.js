import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';

export const AddUser = {
    components: {},
    props: {},
    data() {
        const validateAccount = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter account`))
            } else if (value.length < 6) {
                callback(new Error(`Account can't be less than 6 digit`))
            } else if (value.length > 8) {
                callback(new Error(`Account can't be greater than 8 digit`));
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter password`))
            } else if (value.length < 6) {
                callback(new Error(`Password can't be less than 6 digit`))
            } else if (value.length > 8) {
                callback(new Error(`Password can't be greater than 8 digit`))
            } else {
                callback()
            }
        }
        return {
            userForm: {
                user_name: '',
                account: '',
                password: '',
                user_type: null,
                remarks: ''
            },
            rules: {
                user_name: [
                    { required: true, message: 'Enter name', trigger: 'blur' }
                ],
                account: [
                    { required: true, trigger: 'blur', validator: validateAccount }
                ],
                password: [
                    { required: true, trigger: 'blur', validator: validatePassword }
                ],
                user_type: [
                    { required: true, message: 'Select user type', trigger: 'blur' }
                ]
            },
            userTypeList: []
        };
    },
    mounted() {
        if (this.userForm.user_name === '') {
            this.$refs.user_name.focus()
        }
    },
    created() {
        this.getUserType();
    },
    destroyed() { },
    methods: {
        async getUserType() {
            const response = await http.get('/user-types');
            console.log('user type list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.userTypeList = response.data.data;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        onSubmit() {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.createUser();
                } else {
                    return false;
                }
            });
        },
        async createUser() {
            const response = await http.post('/users', this.userForm);
            console.log('createUser response =>', response);
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
            this.userForm = {
                user_name: '',
                account: '',
                password: '',
                user_type: null,
                remarks: ''
            }
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
