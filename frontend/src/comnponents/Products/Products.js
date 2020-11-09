import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/context'
import { OrdersContext } from '../../context/context'
import { AddProductModal } from './components/AddProductModal'
import styles from './Products.module.scss'
import { readItem } from '../../utils/storeOps'

const Products = () => {
    const [isModalShown, setModalShown] = useState(false)
    const { products, removeProduct, isLoading } = useContext(ShopContext)
    const { orderProduct } = useContext(OrdersContext)
    const userId = readItem('userId')

    const showModal = () => {
        setModalShown(!isModalShown)
    }

    return (
        <div className={styles.wrp}>
            <div>
                <h2>Products:</h2>

                {isModalShown && (
                    <AddProductModal showModal={showModal}/>
                )}

                <main className={styles.products}>
                    <button
                        onClick={showModal}
                    >
                        Create product
                    </button>
                    <ul>
                        {products.map(product => (
                            <li key={product._id}>
                                <div>
                                    <strong>{product.name}</strong> - ${product.price}
                                </div>
                                <div className={styles.actions}>
                                    <Link to={`products/${product._id}`} className={styles.btn}>
                                        Details
                                    </Link>
                                    <button
                                        className={styles.btn}
                                        onClick={orderProduct(product._id)}
                                    >
                                        Add to Order
                                    </button>
                                    <button
                                        className={styles.btn}
                                        onClick={showModal}
                                    >
                                        Change product
                                    </button>
                                    {
                                        product.productCreator === userId && (
                                            <button
                                                className={styles.btn}
                                                onClick={removeProduct(product._id)}
                                            >
                                                Delete
                                            </button>
                                        )
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                </main>

                {isLoading && <p>Products are loading!!!! Wait...</p>}
            </div>
        </div>
    )
}

export { Products }
