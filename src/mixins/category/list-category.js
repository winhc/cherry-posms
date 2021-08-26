import * as http from '@/utils/http';
export const ListCategory = {
  components: {},
  props: {},
  data() {
    return {
      categoryData: []
    };
  },
  mounted() { },
  created() {
    this.getData();
  },
  destroyed() { },
  methods: {
    async getData() {
      const response = await http.get('/categories');
      console.log('category list response => ', response);
      if (response.status == 200) {
        this.categoryData = response.data;
        console.log('categoryData => ', this.categoryData);
      }
    }
  },
  watch: {},
  computed: {},
  filters: {},
};
