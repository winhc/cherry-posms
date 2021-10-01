import * as http from '@/utils/http';
import * as CodeGenerator from '@/utils/code-generator';
import moment from 'moment';
import UploadImage from '../../components/UploadImage/';

export const AddCategory = {
  components: { UploadImage },
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
      imageFile: null,
      isResetImage: false
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
          // console.log('error onSubmit!!');
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
      this.imageFile = null;
      this.isResetImage = true;
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
    }
  },
  watch: {},
  computed: {},
  filters: {},
};
