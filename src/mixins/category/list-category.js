import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../components/DeleteDialog/'
export const ListCategory = {
  components: { DeleteDialog },
  props: {},
  data() {
    return {
      categoryData: [],
      showDeleteDialog: false,
      category_id: 0,
      avatar_url: process.env.VUE_APP_CATEGORY_AVATAR_API,
      isUpdate: false,
      categoryForm: {
        category_name: '',
        remarks: '',
        updated_at: ''
      },
      rules: {
        category_name: [
          { required: true, message: 'Enter category name', trigger: 'blur' }
        ]
      },
      imageUrl: '',
      imageFile: null
    }
  },
  mounted() { },
  created() {
    this.getData()
  },
  destroyed() { },
  methods: {
    async getData() {
      const response = await http.get('/categories')
      console.log('category list response => ', response)
      if (response.status == 200) {
        this.categoryData = response.data
        console.log('categoryData => ', this.categoryData)
      }
    },
    updateCategory(data) {
      console.log('updateCategory=>', data)
      this.categoryForm.category_name = data.category_name;
      this.categoryForm.remarks = data.remarks;
      this.imageUrl = '';
      if (data.image) {
        this.imageUrl = this.avatar_url + data.id + '/' + data.image;
      }
      this.category_id = data.id;
      this.isUpdate = true;
    },
    handleUploadChange(file) {
      if (file) {
        console.log('upload update image==>', file);
        this.imageFile = file.raw; // for upload
        this.imageUrl = URL.createObjectURL(file.raw); // for show
      } else {
        console.log('no file');
      }
    },
    onSubmit() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          this.submitUpdate();
        } else {
          console.log('error onSubmit!!');
          return false;
        }
      });
    },
    async submitUpdate() {
      this.categoryForm.updated_at = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
      let formData = new FormData(); // important for image file upload
      formData.append('category_name', this.categoryForm.category_name);
      formData.append('remarks', this.categoryForm.remarks);
      formData.append('updated_at', this.categoryForm.updated_at);
      formData.append('image', this.imageFile);
      const response = await http.patch(`/categories/${this.category_id}`, formData);
      console.log('createCategory response =>', response);
      if (response.status == 200) {
        this.$message.success(`Success: ${response.statusText}`);
        this.getData();
        this.resetUpdateData();
        this.isUpdate = false;
      } else {
        this.$message.error(`${this.getErrorMessage(response)}`);
      }
    },
    resetUpdateData() {
      this.category_id = 0;
      this.categoryForm.category_name = '';
      this.categoryForm.remarks = '';
      this.categoryForm.updated_at = '';
      this.imageUrl = '';
      this.imageFile = null;
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
    deleteCategory(data) {
      // console.log('deleteCategory=>', data)
      this.category_id = data.id;
      this.showDeleteDialog = true
    },
    async confirmDelete(remarks) {
      // console.log('remarks=>', remarks)
      const response = await http.delete(`/categories/${this.category_id}`)
      console.log('category delete response => ', response)
      if (response.status == 200) {
        this.showDeleteDialog = false;
        this.category_id = 0;
        this.$message.success(`Success: ${response.statusText}`);
        this.getData();
      } else {
        this.$message.error(`Fail: ${response.statusText} Messaage: ${this.getErrorMessage(response.message)}`);
      }
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
