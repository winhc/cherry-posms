import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../../components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'
import store from '@/store'

export const ListUser = {
    components: { DeleteDialog },
    props: {},
    data() {
        const validateAccount = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(`Enter account`))
            } else if (value.length < 6) {
                callback(new Error(`Account can't be less than 6 digit`))
            } else if (value.length > 8) {
                callback(new Error(`Account can't be greater than 8 digit`))
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
            userData: [],
            showDeleteDialog: false,
            user_id: 0,
            isUpdate: false,
            userForm: {
                user_name: '',
                account: '',
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
                user_type: [
                    { required: true, message: 'Select user type', trigger: 'blur' }
                ],
                remarks: [
                    { required: true, message: 'Enter remarks', trigger: 'blur' }
                ]
            },
            pickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() > new Date().getTime();
                }
            },
            searchForm: {
                dateData: [currentDate(), currentDate()],
                account: '',
                isAll: true
            },
            pageSize: 10,
            pageIndex: 1,
            tableDataCount: 0,
            tableLoading: false,
            downloadLoading: false,
            userTypeList: []
        }
    },
    mounted() { },
    created() {
        this.getData();
    },
    destroyed() { },
    methods: {
        async getData() {
            this.tableLoading = true;
            console.log('searchForm', this.searchForm);
            const from_date = this.searchForm.dateData[0];
            const to_date = this.searchForm.dateData[1];
            let url = '';
            if (this.searchForm.isAll) {
                url = '/users?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&account=' + this.searchForm.account
            } else {
                url = '/users?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&account=' + this.searchForm.account
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('user list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    const dataArr = response.data.data;
                    const index = dataArr.findIndex(x => x.account == store.getters.userInfo.account);
                    if (index > -1) {
                        dataArr.splice(index, 1);
                    }
                    this.userData = dataArr;
                    this.tableDataCount = response.data.count
                    this.getUserType();
                    console.log('userData => ', this.userData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
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
        handleDownload() {
            try {
                this.downloadLoading = true;
                const tHeader = ['Name', 'Account', 'Role', 'Created At', 'Updated At', 'Remarks']
                const tBody = [];
                for (const i in this.userData) {
                    let item = this.userData[i];
                    let data = [
                        item.user_name,
                        item.account,
                        item.user_type.user_role,
                        this.formattedDate(item.created_at),
                        this.formattedDate(item.updated_at),
                        item.remarks
                    ];
                    tBody.push(data);
                }
                const now = new Date();
                const fileName = 'UserData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
                import('@/vendor/Export2Excel').then(excel => {
                    excel.export_json_to_excel({
                        header: tHeader,
                        data: tBody,
                        filename: fileName,
                        autoWidth: true,
                        bookType: 'xlsx'
                    })
                    this.downloadLoading = false
                })
            } catch (erorr) {
                console.log('Download => ', error);
            }
        },
        formattedDate(date) {
            return moment(date).format('DD-MM-YYYY')
        },
        handleSwitchAndSearch() {
            this.resetPagination();
            this.getData();
        },
        resetPagination() {
            this.pageIndex = 1;
            this.pageSize = 10;
        },
        updateUser(data) {
            console.log('updateUser=>', data)
            this.userForm.user_name = data.user_name;
            this.userForm.account = data.account;
            this.userForm.user_type = data.user_type.id;
            this.userForm.remarks = data.remarks;
            this.user_id = data.id;
            this.isUpdate = true;
        },
        onSubmit() {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    console.log('userForm=>>', this.userForm);
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            const response = await http.patch(`/users/${this.user_id}`, this.userForm);
            console.log('updateUser response =>', response);
            if (response != null) {
                if (response.status == 200) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.getData();
                    this.resetUpdate();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        resetUpdate() {
            this.user_id = 0;
            this.isUpdate = false;
            this.userForm = {
                user_name: '',
                account: '',
                user_type: null,
                remarks: ''
            };
        },
        deleteUser(data) {
            this.user_id = data.id;
            this.showDeleteDialog = true
        },
        async confirmDelete(remarks) {
            // console.log('remarks=>', remarks)
            const response = await http.delete(`/users/${this.user_id}`)
            console.log('user delete response => ', response)
            if (response.status == 200) {
                this.showDeleteDialog = false;
                this.user_id = 0;
                this.$message.success(`Success: ${response.statusText}`);
                this.getData();
            } else {
                this.$message.error(`${getErrorMessage(response)}`);
            }
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.pageIndex = 1;
            this.getData();
        },
        handlePageIndexChange(index) {
            this.pageIndex = index;
            this.getData();
        }
    },
    watch: {},
    computed: {},
    filters: {
        moment: function (date) {
            return moment(date).format('DD-MM-YYYY')
        }
    }
}
