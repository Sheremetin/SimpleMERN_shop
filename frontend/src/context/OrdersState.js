import React, { useEffect, useState } from 'react'
import { OrdersContext } from './context'
import { readItem } from '../utils/storeOps'
import remove from 'lodash/remove'
import { useFetch } from '../utils/customHooks/useFetch'
import { useToastNotif } from '../utils/customHooks/useToastNotif'

const OrdersState = props => {
    const [orders, setOrders] = useState([])
    const [error, setError] = useState('')
    const token = readItem('token')

    const { isLoading, request, error: fetchErr } = useFetch()
    const message = useToastNotif()

    useEffect(() => {
        token && message(fetchErr)
    }, [message, fetchErr])

    const orderProduct = productId => async () => {
        try{
            const order = {
                productId,
                quantity: 7
            }

            const data = await request('/api/orders', 'POST', { ...order }, {'Authorization': `Bearer ${token}`})

            const mergedOrders = orders.concat(data)

            setOrders(mergedOrders)
            message(data.msg || 'created')
        } catch(err) {
            console.log(`Sth went wrong: ${err}`)
            setError('Sth went wrong while order creating!')
        }
    }

    const deleteOrder = orderId => async () => {
        try {
            const data = await request(`/api/orders/${orderId}`, 'DELETE', null, {'Authorization': `Bearer ${token}`})

            const updatedOrders = remove(orders, order => order._id !== orderId)
            setOrders(updatedOrders)
            message(data.msg || 'deleted')
        } catch (err) {
            console.log('ERR: ', err)
        }
    }

    const fetchOrders = async () => {
        console.log('SHOULD NOT FETCH THIS ')
        try {
            const data = await request(`/api/orders`, 'GET', null, {'Authorization': `Bearer ${token}`})

            setOrders(data.orders)
        } catch (err) {console.log('ERR ORDERS: ', err)}
    }

    useEffect(() => {
        token && fetchOrders()
        // eslint-disable-next-line
    }, [])

    return (
        <OrdersContext.Provider value={{
            orders,
            orderProduct,
            deleteOrder,
            error,
            isLoading,
        }}>
            {props.children}
        </OrdersContext.Provider>
    )

}

export { OrdersState }
