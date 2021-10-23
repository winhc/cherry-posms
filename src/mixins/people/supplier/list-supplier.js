import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../../components/DeleteDialog'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'

export const ListSupplier = {
    components: { DeleteDialog },
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
            supplierData: [],
            showDeleteDialog: false,
            supplier_id: 0,
            isUpdate: false,
            supplierForm: {
                supplier_name: '',
                phone: '',
                address: null,
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
                supplier_name: '',
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
                url = '/suppliers?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&supplier_name=' + this.searchForm.supplier_name
            } else {
                url = '/suppliers?page_size=' + this.pageSize
                    + '&page_index=' + this.pageIndex
                    + '&supplier_name=' + this.searchForm.supplier_name
                    + '&from_date=' + from_date
                    + '&to_date=' + to_date
            }
            const response = await http.get(url);
            console.log('supplier list response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.supplierData = response.data.data;
                    this.tableDataCount = response.data.count;
                    console.log('supplierData => ', this.supplierData)
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
            this.tableLoading = false;
        },
        handleDownload() {
            try {
                this.downloadLoading = true;
                const tHeader = ['Supplier name', 'Phone', 'Address', 'Created At', 'Updated At', 'Remarks']
                const tBody = [];
                for (const i in this.supplierData) {
                    let item = this.supplierData[i];
                    let data = [
                        item.supplier_name,
                        item.phone,
                        item.address,
                        this.formattedDate(item.created_at),
                        this.formattedDate(item.updated_at),
                        item.remarks
                    ];
                    tBody.push(data);
                }
                const now = new Date();
                const fileName = 'SupplierData_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '_' + now.getHours() + now.getMinutes() + now.getSeconds();
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
        updateSupplier(data) {
            console.log('updateSupplier=>', data)
            this.supplierForm.supplier_name = data.supplier_name;
            this.supplierForm.phone = data.phone?.substring(2);
            this.supplierForm.address = data.address;
            this.supplierForm.remarks = data.remarks;
            this.supplier_id = data.id;
            this.isUpdate = true;
        },
        onSubmit() {
            this.$refs.supplierForm.validate((valid) => {
                if (valid) {
                    console.log('supplierForm=>>', this.supplierForm);
                    this.submitUpdate();
                } else {
                    console.log('error onSubmit!!');
                    return false;
                }
            });
        },
        async submitUpdate() {
            const response = await http.patch(`/suppliers/${this.supplier_id}`, this.supplierForm);
            console.log('updateSupplier response =>', response);
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
            this.supplier_id = 0;
            this.isUpdate = false;
            this.supplierForm = {
                supplier_name: '',
                phone: '',
                address: '',
                remarks: ''
            };
        },
        deleteUser(data) {
            this.supplier_id = data.id;
            this.showDeleteDialog = true
        },
        async confirmDelete(remarks) {
            // console.log('remarks=>', remarks)
            const response = await http.delete(`/suppliers/${this.supplier_id}`)
            console.log('user delete response => ', response)
            if (response.status == 200) {
                this.showDeleteDialog = false;
                this.supplier_id = 0;
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
        closeAlert(){
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
