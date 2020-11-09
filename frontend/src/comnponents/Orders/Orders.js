import React, { useContext } from 'react'
import { OrdersContext } from '../../context/context'

import './Orders.scss'

const Orders = () => {
    const {deleteOrder, orders} = useContext(OrdersContext)

    const ordersWithProducts = orders.filter(order => order.productId)

    return (
        <main className="cart">
            {ordersWithProducts.length <= 0 ? (
                <p>No Item in the Cart!</p>
            ) : (
                <ul>
                    {orders.length > 0 && (
                        <ol>
                            {ordersWithProducts.map((order, i) => (
                                <li key={i}>
                                    Name: {order.productId.name}
                                    <br/>
                                    Price: {order.quantity}
                                    <br/>
                                    <button onClick={deleteOrder(order._id)}>delete</button>
                                </li>
                            ))}
                        </ol>
                    )}
                </ul>
            ) }
        </main>
    )
}


export { Orders }
