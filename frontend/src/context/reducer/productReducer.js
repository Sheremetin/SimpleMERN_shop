export const GET_PRODUCTS = 'GET_PRODUCTS'
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'

const handlers = {
    [GET_PRODUCTS]: (state, { payload }) => ({ ...state, products: payload })
    ,
    [ADD_PRODUCT]: (state, { payload }) => ({ ...state, products: [...state.products, payload] }),
    [DELETE_PRODUCT]: (state, { payload }) => ({
        ...state,
        products: state.products.filter(product => product._id !== payload.productId)
    }),
    DEFAULT: state => state,
}

export const productReducer = (state, action) => {
    const handle = handlers[action.type] || handlers.DEFAULT

    return handle(state, action)
}
