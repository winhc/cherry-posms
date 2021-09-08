import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../components/DeleteDialog/'
export const ListCategory = {
  components: { DeleteDialog },
  props: {},
  data() {
    return {
      categoryData: [],
      showDeleteDialog: false
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
      this.showDeleteDialog = true
    },
    comfirmDelete(remarks) {
      this.showDeleteDialog = false
      console.log('remarks=>', remarks)
    }
  },
  watch: {},
  computed: {},
  filters: {
    moment: function(date) {
      return moment(date).format('DD-MM-YYYY, h:mm:ss')
    }
  }
}
