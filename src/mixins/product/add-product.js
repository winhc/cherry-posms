import * as http from '@/utils/http';
import { getErrorMessage } from '@/utils/message-tip';
import UploadImage from '@/components/UploadImage/';
import * as CodeGenerator from '@/utils/code-generator';

export const AddProduct = {
    components: { UploadImage },
    props: {},
    data() {
        return {
            productForm: {
                product_code: CodeGenerator.getCode({ prefix: 'P', length: 5 }),
                product_name: '',
                category: null,
                brand: null,
                remarks: ''
            },
            rules: {
                product_name: [
                    { required: true, message: 'Enter product name', trigger: 'blur' },
                ],
                category: [
                    { required: true, message: 'Select category', trigger: 'blur' },
                ],
                brand: [
                    { required: true, message: 'Select brand', trigger: 'blur' },
                ]
            },
            imageFile: null,
            isResetImage: false,
            categoryList: [],
            brandList: [],
            pickerOptions: {
                disabledDate: function (date) {
                    return new Date(date).getTime() < new Date().getTime();
                }
            },
        };
    },
    mounted() {
        if (this.productForm.product_name === '') {
            this.$refs.product_name.focus()
        }
    },
    created() {
        this.getProductOption();
    },
    destroyed() { },
    methods: {
        async getProductOption() {
            const response = await http.get('/products/product-options');
            console.log('product option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.brandList = response.data.brand.data;
                    this.categoryList = response.data.category.data;
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        async createProduct() {
            console.log('productForm', this.productForm)
            let formData = new FormData(); // important for image file upload
            formData.append('product_code', this.productForm.product_code);
            formData.append('product_name', this.productForm.product_name);
            formData.append('category', this.productForm.category);
            formData.append('brand', this.productForm.brand);
            formData.append('remarks', this.productForm.remarks);
            formData.append('image', this.imageFile);
            const response = await http.post('/products', formData);
            console.log('createProduct response =>', response);
            if (response != null) {
                if (response.status == 201) {
                    this.$message.success(`Success: ${response.statusText}`);
                    this.resetForm();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        onSubmit() {
            this.$refs.productForm.validate((valid) => {
                if (valid) {
                    this.createProduct();
                } else {
                    return false;
                }
            });
        },
        deleteImage(file) {
            // console.log('deleteImage view==>', file);
            this.imageFile = file;
        },
        handleUploadChange(file) {
            // console.log('handleUploadChange view==>', file);
            if (file) {
                this.imageFile = file.raw;
                this.isResetImage = false;
            }
        },
        resetForm() {
            this.productForm = {
                product_code: CodeGenerator.getCode({ prefix: 'P', length: 5 }),
                product_name: '',
                category: null,
                brand: null,
                remarks: ''
            }
            this.imageFile = null;
            this.isResetImage = true;
        }
    },
    watch: {},
    computed: {},
    filters: {

    }
}
