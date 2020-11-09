import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { readItem } from '../../utils/storeOps'
import { OrdersContext } from '../../context/context'
import { deleteItem } from '../../utils/storeOps'
import logo from './logo.png'
import './MainNavigation.scss'

const MainNavigation = () => {
    const token = readItem('token')
    const { orders } = useContext(OrdersContext)

    const logout = () => {
        deleteItem('token')
        deleteItem('userId')
        Promise.resolve().then(() => {
            window.location.reload()
        })
    }

    return (
        <header className="main-navigation">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/"><img src={logo} alt="logo" className="logo"/></NavLink>
                    </li>
                    <li>
                        <NavLink to="/products">Products</NavLink>
                    </li>
                    {token && (
                        <li>
                            <NavLink to="/orders">Cart ({orders && (orders.filter(order => order.productId).length || 0)})</NavLink>
                        </li>
                    )}
                </ul>

              {!token ? (
                  <div className="actions">
                      <NavLink to="/login" className="btn btn-login">Login</NavLink>
                      <NavLink to="/signup" className="btn btn-signup">Signup</NavLink>
                  </div>
              ) : (
                  <div className="actions">
                      <button className="btn btn-login" onClick={logout}>Log out</button>
                  </div>
              )}
            </nav>
        </header>
    )
}

export { MainNavigation }
