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
    editCategory(data) {
      console.log('editCategory=>', data)
    },
    deleteCategory(data) {
      console.log('deleteCategory=>', data)
      this.category_id = data.id;
      this.showDeleteDialog = true
    },
    async confirmDelete(remarks) {
      console.log('remarks=>', remarks)
      const response = await http.delete(`/categories/${this.category_id}`)
      console.log('category delete response => ', response)
      if (response.status == 200) {
        this.showDeleteDialog = false;
        this.category_id = 0 ;
        this.getData();
      }
    }
  },
  watch: {},
  computed: {},
  filters: {
    moment: function(date) {
      return moment(date).format('DD-MM-YYYY')
    }
  }
}
