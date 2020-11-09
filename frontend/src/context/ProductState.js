import React, { useEffect, useState, useReducer } from 'react'
import { ShopContext } from './context'
import { readItem } from '../utils/storeOps'
import { ADD_PRODUCT, productReducer, DELETE_PRODUCT, GET_PRODUCTS } from './reducer/productReducer'
import { useFetch } from '../utils/customHooks/useFetch'
import { useToastNotif } from '../utils/customHooks/useToastNotif'

const ProductState = props => {
    const initialState = {
        products: [],
        loading: false
    }
    const [error, setError] = useState('')
    const token = readItem('token')
    const [state, dispatch] = useReducer(productReducer, initialState)
    const { isLoading, request, error: fetchErr } = useFetch()
    const message = useToastNotif()

    useEffect(() => {
        console.log('PRODUCT...')
        message(error)
    }, [message, error])

    const fetchAllProducts = async() => {
        try {
            const data = await request('/api/products')
            dispatch({
                type: GET_PRODUCTS,
                payload: data.products
            })
            data.msg && message(data.msg)
        } catch (err) {
            setError(err || 'Sth went wrong!')
        }
    }

    const addProduct = async (product = {}) => {
        try {
            const data = await request('/api/products', 'POST', { ...product }, {'Authorization': `Bearer ${token}`})
            dispatch({
                type: ADD_PRODUCT,
                payload: data.createdProduct,
            })
            data.msg && message(data.msg)
        } catch (err) {setError(err.message || 'Sth went wrong!')}
    }

    const removeProduct = productId => async () => {
        try {
            const response = await request(`/api/products/${productId}`, 'DELETE', null, {'Authorization': `Bearer ${token}`})

            if (!response.ok) {
                throw new Error(response.msg)
            }
            message('Product was deleted')
            dispatch({
                type: DELETE_PRODUCT,
                payload: { productId },
            })
        } catch (err) {setError(err || 'Sth went wrong!')}
    }

    // TODO:
    // const updateProduct = () => {
    //
    // }

    useEffect(() => {
        fetchAllProducts()
        // eslint-disable-next-line
    }, [])

    return (
        <ShopContext.Provider value={{
            products: state.products,
            isLoading,
            addProduct,
            removeProduct,
            fetchAllProducts,
            error,
            setError
        }}>
            {props.children}
        </ShopContext.Provider>
    )

}

export { ProductState }
