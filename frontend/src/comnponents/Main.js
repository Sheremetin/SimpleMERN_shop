import React, { useContext, Fragment } from 'react'
import { ShopContext } from '../context/context'

const Main = () => {
    const context = useContext(ShopContext)

    return (
        <Fragment>
            <div className="wrp">
                <div>
                    <h2>Products:</h2>

                    {context.products.length > 0 && (
                        <ul>
                            {context.products.map(product => {
                                return (
                                    <li key={product._id} style={{ padding: '10px'}}>
                                        Name: {product.name}
                                        <br/>
                                        Price: {product.price}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {context.error && (
                <p style={{ padding: '10px', borderRadius: '5px', background: 'red' }}>{context.error}</p>
            )}

            {context.isLoading && <p>Products are loading!!!! Wait...</p>}
        </Fragment>

    )
}

export { Main }
