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
        image_url: '',
        remarks: '',
        created_at: moment(new Date()).format('DD-MM-YYYY')
      },
      rules: {
        category_name: [
          { required: true, message: 'Enter category name', trigger: 'blur' }
        ]
      }
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
      const response = await http.post('/categories', this.categoryForm);
      console.log('createCategory response =>', response);
      if (response.status == 201) {
        this.$message.success(`Success: ${response.statusText}`);
        this.resetCategoryForm();
      } else {
        this.$message.error(`Fail: ${response.statusText}`);
      }
    },
    resetCategoryForm() {
      this.categoryForm = {
        category_code: CodeGenerator.getCode({ length: 5 }),
        category_name: '',
        image_url: '',
        remarks: '',
        created_at: moment(new Date()).format('DD-MM-YYYY')
      }
    }
  },
  watch: {},
  computed: {},
  filters: {},
};
