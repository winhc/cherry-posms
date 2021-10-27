import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '@/components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'

export const ListUserType = {
    components: { DeleteDialog },
    props: {},
    data() {
        return {
            userTypeData: [],
            showDeleteDialog: false,
            user_type_id: 0,
            isUpdate: false,
            userTypeForm: {
                user_role: '',
                remarks: ''
            },
            rules: {
                user_role: [
                    { required: true, message: 'Enter user role', trigger: 'blur' }
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
                user_role: '',
                isAll: true
            },
            pageSize: 10,
            pageIndex: 1,
            tableDataCount: 0,
            tableLoading: false,
            downloadLoading: false,
            messageAlert: {
                title: '',
                isSuccess: true,
                isShow: false,
            }
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
                url = '/user-types?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&user_role=' + this.searchForm.user_role
            } else {
                url = '/user-types?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&user_role=' + this.searchForm.user_role
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('user type list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.userTypeData = response.data.data
                    this.tableDataCount = response.data.count
                    console.log('userTypeData => ', this.userTypeData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        handleDownload() {
            try {
                this.downloadLoading = true;
                const tHeader = ['User Role', 'Created At', 'Updated At', 'Remarks']
                const tBody = [];
                for (const i in this.userTypeData) {
                    let item = this.userTypeData[i];
                    let data = [
                        item.user_role,
                        this.formattedDate(item.created_at),
                        this.formattedDate(item.updated_at),
                        item.remarks
                    ];
                    tBody.push(data);
                }
                const now = new Date();
                const fileName = 'UserTypeData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
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
        updateUserType(data) {
            console.log('updateUserType=>', data)
            this.userTypeForm.user_role = data.user_role;
            this.userTypeForm.remarks = data.remarks;
            this.user_type_id = data.id;
            this.isUpdate = true;
        },
        onSubmit() {
            this.$refs.userTypeForm.validate((valid) => {
                if (valid) {
                    console.log('userTypeForm=>>', this.userTypeForm);
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            const response = await http.patch(`/user-types/${this.user_type_id}`, this.userTypeForm);
            console.log('updateUserType response =>', response);
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
            this.user_type_id = 0;
            this.userTypeForm.user_role = '';
            this.userTypeForm.remarks = '';
            this.isUpdate = false;
        },
        deleteUserType(data) {
            this.user_type_id = data.id;
            this.showDeleteDialog = true
        },
        async confirmDelete(remarks) {
            // console.log('remarks=>', remarks)
            const response = await http.delete(`/user-types/${this.user_type_id}`)
            console.log('user type delete response => ', response)
            if (response.status == 200) {
                this.showDeleteDialog = false;
                this.user_type_id = 0;
                this.$message.success(`Success: ${response.statusText}`);
                this.getData();
            } else {
                this.messageAlert = {
                    title: getErrorMessage(response),
                    isSuccess: false,
                    isShow: true
                }
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
        },
        closeAlert() {
            console.log('close alert')
            this.messageAlert.isShow = false;
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
