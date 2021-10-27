import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '@/components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'

export const ListCustomer = {
    components: { DeleteDialog },
    props: {},
    data() {
        const validatePhoneNumber = (rule, value, callback) => {
            if (this.customerForm.phone != '') {
                if (value.length < 9) {
                    callback(new Error(`Phone number can't be less than 9 digit`))
                } else if (value.length > 9) {
                    callback(new Error(`Phone number can't be greater than 9 digit`))
                } else {
                    callback()
                }
            }
        }
        return {
            customerData: [],
            showDeleteDialog: false,
            customer_id: 0,
            isUpdate: false,
            customerForm: {
                customer_name: '',
                phone: null,
                address: '',
                remarks: ''
            },
            rules: {
                customer_name: [
                    { required: true, message: 'Enter customer name', trigger: 'blur' }
                ],
                phone: [
                    { required: false, trigger: 'blur', validator: validatePhoneNumber }
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
                customer_name: '',
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
                url = '/customers?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&customer_name=' + this.searchForm.customer_name
            } else {
                url = '/customers?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&customer_name=' + this.searchForm.customer_name
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('customer list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.customerData = response.data.data;
                    this.tableDataCount = response.data.count;
                    console.log('customerData => ', this.customerData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        handleDownload() {
            try {
                this.downloadLoading = true;
                const tHeader = ['Customer name', 'Phone', 'Address', 'Created At', 'Updated At', 'Remarks']
                const tBody = [];
                for (const i in this.customerData) {
                    let item = this.customerData[i];
                    let data = [
                        item.customer_name,
                        item.phone,
                        item.address,
                        this.formattedDate(item.created_at),
                        this.formattedDate(item.updated_at),
                        item.remarks
                    ];
                    tBody.push(data);
                }
                const now = new Date();
                const fileName = 'CustomerData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
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
        updateCustomer(data) {
            console.log('updateCustomer=>', data)
            this.customerForm.customer_name = data.customer_name;
            this.customerForm.phone = data.phone?.substring(2);
            this.customerForm.address = data.address;
            this.customerForm.remarks = data.remarks;
            this.customer_id = data.id;
            this.isUpdate = true;
        },
        onSubmit() {
            this.$refs.customerForm.validate((valid) => {
                if (valid) {
                    console.log('customerForm=>>', this.customerForm);
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            const response = await http.patch(`/customers/${this.customer_id}`, this.customerForm);
            console.log('updateCustomer response =>', response);
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
            this.customer_id = 0;
            this.isUpdate = false;
            this.customerForm = {
                customer_name: '',
                phone: '',
                address: '',
                remarks: ''
            };
        },
        deleteCustomer(data) {
            this.customer_id = data.id;
            this.showDeleteDialog = true
        },
        async confirmDelete(remarks) {
            // console.log('remarks=>', remarks)
            const response = await http.delete(`/customers/${this.customer_id}`)
            console.log('user delete response => ', response)
            if (response.status == 200) {
                this.showDeleteDialog = false;
                this.customer_id = 0;
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
