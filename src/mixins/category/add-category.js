import * as http from '@/utils/http';
import * as CodeGenerator from '@/utils/code-generator';
import moment from 'moment';

export const AddCategory = {
  components: {},
  props: {},
  data() {
    return {
      categoryForm: {
        category_code: CodeGenerator.getCode({ length: 5 }),
        category_name: '',
        remarks: '',
        created_at: moment(new Date()).format('DD-MM-YYYY')
      },
      rules: {
        category_name: [
          { required: true, message: 'Enter category name', trigger: 'blur' }
        ]
      },
      imageUrl: '',
      imageFile: null
    };
  },
  mounted() {
    this.$refs.category_name.focus();
  },
  created() {
  },
  destroyed() { },
  methods: {
    onSubmit() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          this.createCategory();
        } else {
          console.log('error onSubmit!!');
          return false;
        }
      });
    },
    async createCategory() {
      this.categoryForm.created_at = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
      let formData = new FormData(); // important for image file upload
      formData.append('category_code', this.categoryForm.category_code);
      formData.append('category_name', this.categoryForm.category_name);
      formData.append('remarks', this.categoryForm.remarks);
      formData.append('created_at', this.categoryForm.created_at);
      formData.append('image', this.imageFile);
      const response = await http.post('/categories', formData);
      console.log('createCategory response =>', response);
      if (response.status == 201) {
        this.$message.success(`Success: ${response.statusText}`);
        this.resetCategoryForm();
      } else {
        this.$message.error(`${this.getErrorMessage(response)}`);
      }
    },
    getErrorMessage(response) {
      console.log('response', response);
      let errorTip = '';
      errorTip += 'Fail: ' + response?.statusText;
      let message = '';
      if (response.message) {
        for (const msg in response) {
          console.log('message: ', msg);
          message += msg;
        }
        errorTip += 'Message: ' + message;
      }
      return errorTip;
    },
    resetCategoryForm() {
      this.categoryForm = {
        category_code: CodeGenerator.getCode({ length: 5 }),
        category_name: '',
        remarks: '',
        created_at: moment(new Date()).format('DD-MM-YYYY')
      }
      this.imageUrl = '';
      this.imageFile = null;
    },
    handleUploadChange(file) {
      if (file) {
        console.log('upload image==>', file);
        this.imageFile = file.raw;
        this.imageUrl = URL.createObjectURL(file.raw);
      } else {
        console.log('no file');
      }
    },
    async getImage(id) {
      const image = await http.get(`/categories/images/${id}`);
      console.log('getImage==>', image);
      return '';
    }
  },
  watch: {},
  computed: {},
  filters: {},
};
