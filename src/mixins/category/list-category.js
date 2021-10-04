import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../components/DeleteDialog/'
import UploadImage from '../../components/UploadImage/';
import { getErrorMessage } from '@/utils/message-tip';
export const ListCategory = {
  components: { DeleteDialog, UploadImage },
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
        image: '',
        remarks: ''
      },
      rules: {
        category_name: [
          { required: true, message: 'Enter category name', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: 'Enter remarks', trigger: 'blur' }
        ]
      },
      imageUrl: '',
      imageFile: null,
      isResetImage: false,
      pickerOptions: {
        disabledDate: function (date) {
          return new Date(date).getTime() > new Date().getTime();
        }
      },
      searchForm: {
        dateData: [new Date(), new Date()],
        category_name: '',
        isAll: true
      }
    }
  },
  mounted() { },
  created() {
    this.getData()
  },
  destroyed() { },
  methods: {
    async getData() {
      console.log('searchForm', this.searchForm);
      const from_date = this.dateFormat(this.searchForm.dateData[0]);
      const to_date = this.dateFormat(this.searchForm.dateData[1]);
      let url = '';
      if (this.searchForm.isAll) {
        url = '/categories?category_name=' + this.searchForm.category_name
      } else {
        url = '/categories?category_name=' + this.searchForm.category_name
          + '&from_date=' + from_date
          + '&to_date=' + to_date
      }
      const response = await http.get(url);
      console.log('category list response => ', response)
      if (response != null) {
        if (response.status == 200) {
          this.categoryData = response.data
          console.log('categoryData => ', this.categoryData)
        } else {
          this.$message.error(`${getErrorMessage(response)}`);
        }
      }
    },
    dateFormat(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    updateCategory(data) {
      console.log('updateCategory=>', data)
      this.categoryForm.category_name = data.category_name;
      this.categoryForm.remarks = data.remarks;
      this.categoryForm.image = data.image;
      this.imageUrl = '';
      if (data.image) {
        this.imageUrl = this.avatar_url + data.id + '/' + data.image;
      }
      this.category_id = data.id;
      this.isUpdate = true;
    },
    handleUploadChange(file) {
      console.log('handleUploadChange view==>', file);
      if (file) {
        this.imageFile = file.raw;
        this.imageUrl = this.imageUrl = URL.createObjectURL(file.raw);
        this.isResetImage = false;
      }
    },
    deleteImage(file) {
      console.log('deleteImage view==>', file);
      this.imageFile = file;
      this.categoryForm.image = '';
    },
    onSubmit() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          console.log('imageUrl=>>', this.imageUrl);
          console.log('imageFile=>>', this.imageFile);
          console.log('categoryForm=>>', this.categoryForm);
          this.submitUpdate();
        } else {
          console.log('error onSubmit!!');
          return false;
        }
      });
    },
    async submitUpdate() {
      let formData = new FormData(); // important for image file upload
      formData.append('category_name', this.categoryForm.category_name);
      formData.append('remarks', this.categoryForm.remarks);
      if (this.imageUrl == '') {
        formData.append('image', '');
      } else {
        formData.append('image', this.imageFile || this.categoryForm.image);
      }
      const response = await http.patch(`/categories/${this.category_id}`, formData);
      console.log('updateCategory response =>', response);
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
      this.category_id = 0;
      this.categoryForm.category_name = '';
      this.categoryForm.remarks = '';
      this.imageUrl = '';
      this.imageFile = null;
      this.isUpdate = false;
      this.isResetImage = true;
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
        this.$message.error(`Fail: ${response.statusText} Messaage: ${getErrorMessage(response.message)}`);
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
