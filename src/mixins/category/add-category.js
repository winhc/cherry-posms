import * as http from '@/utils/http';
import * as CodeGenerator from '@/utils/code-generator';

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
        created_at: '2021-08-21 19:24:26'
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
        created_at: '2021-08-21 19:24:26'
      }
    }
  },
  watch: {},
  computed: {},
  filters: {},
};
