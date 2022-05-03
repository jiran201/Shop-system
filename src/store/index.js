import { createStore } from 'vuex'

export default createStore({
    state: {
        OrdersObj:{}
    },
    mutations: {
        changeDialog(state,payload){
            const { OrdersDialogVisible, isTitle } = payload
            state.OrdersObj.OrdersDialogVisible = OrdersDialogVisible
            state.OrdersObj.isTitle = isTitle 
            console.log(state.OrdersObj);
        }
    },
    actions: {
    },
    modules: {
    }
})
