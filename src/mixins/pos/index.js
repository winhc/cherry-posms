import * as http from '@/utils/http'
import moment from 'moment'
import DeleteDialog from '../../components/DeleteDialog/'
import { getErrorMessage } from '@/utils/message-tip'
import { currentDate } from '@/utils/date-format'
import * as CodeGenerator from '@/utils/code-generator';

export const POS = {
    components: { DeleteDialog },
    props: {},
    data() {
        return {
            categoryAvatarUrl: process.env.VUE_APP_CATEGORY_AVATAR_API,
            categoryList: [],
            selectedCategory: 0,
            productList: [],
            customerList: [],
            selectedCustomer: 1,
            orderList: [],
            totalQuantity: 0,
            totalAmount: 0,
            orderCode: CodeGenerator.generateCode({ prefix: 'ODR', length: 5 }),
            productName: '',
        }
    },
    mounted() { },
    created() {
        this.getPOSOption();
    },
    destroyed() { },
    methods: {
        async getPOSOption() {
            const response = await http.get('/pos');
            console.log('pos option response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    this.customerList = response.data.customer.data;
                    this.categoryList = response.data.category.data;
                    const all = {
                        id: 0,
                        category_name: 'All',
                        image: null
                    };
                    this.categoryList.splice(0, 0, all);
                    this.getProduct();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        selectCategory(data) {
            console.log('selectCategory => ', data);
            this.selectedCategory = data.id;
            this.getProduct();
        },
        selectProduct(data) {
            // console.log('selectProduct => ', data);
            const tempOrder = {
                order_code: this.orderCode,
                product: data.id,
                product_name: data.product_name,
                status: 'paid',
                customer: this.selectedCustomer,
                quantity: 1,
                price: data.price,
                remarks: '',
            };
            const tempOrderList = this.orderList;
            const index = tempOrderList.findIndex(item => item.product == data.id);
            // console.log('order index =>', index);
            if (index != -1) {
                tempOrder.quantity = tempOrderList[index].quantity + 1;
                tempOrderList[index] = tempOrder;
            } else {
                tempOrderList.push(tempOrder);
            }
            this.orderList = [];
            this.orderList = tempOrderList;
            // console.log('orderList => ', this.orderList)
            this.totalQuantity = 0;
            this.totalAmount = 0;
            for (var item of this.orderList) {
                console.log('orderItem => ', item);
                this.totalQuantity += item.quantity;
                this.totalAmount += item.quantity * item.price;
            }
        },
        clearOrder() {
            if (this.orderList.length != 0) {
                this.orderList = [];
                this.totalQuantity = 0;
                this.totalAmount = 0;
                this.orderCode = CodeGenerator.generateCode({ prefix: 'ODR', length: 5 });
            }
        },
        async createOrder() {
            const response = await http.post(`/orders`, this.orderList);
            console.log('create order response => ', response)
            if (response != null) {
                if (response.status == 201) {
                    this.$message.success(response.data.message);
                    this.clearOrder();
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        async getProduct() {
            const response = await http.get(`/pos/products?category_id=${this.selectedCategory}&product_name=${this.productName}`);
            console.log('product response => ', response)
            if (response != null) {
                if (response.status == 200) {
                    const resData = response.data.data;
                    this.productList = this.listToMatrix(resData, 6);
                    console.log('ddd==>', this.productList);
                } else {
                    this.$message.error(`${getErrorMessage(response)}`);
                }
            }
        },
        listToMatrix(list, elementPerSubArray) {
            var matrix = [], i, k;
            for (i = 0, k = -1; i < list.length; i++) {
                if (i % elementPerSubArray === 0) {
                    k++;
                    matrix[k] = [];
                }
                matrix[k].push(list[i]);
            }
            return matrix;
        },
    },
    watch: {},
    computed: {},
    filters: {
    }
}
