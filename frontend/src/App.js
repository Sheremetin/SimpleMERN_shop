import React, { Fragment } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Main } from './comnponents/Main'
import { Products } from './comnponents/Products'
import { Product } from './comnponents/Product'
import { Signup } from './comnponents/Signup/index'
import { Login } from './comnponents/Login'
import { ProductState } from './context/ProductState'
import { OrdersState } from './context/OrdersState'
import { Orders } from './comnponents/Orders'
import { MainNavigation } from './comnponents/Nav'
import { readItem } from './utils/storeOps'


import 'react-toastify/dist/ReactToastify.css';
import './style.scss'

//TODO: create separate  component for ToastContainer
const CloseButton = ({ closeToast }) => (
    <button
        type="button"
        onClick={closeToast}
        style = {{
            outline: 'none',
            background: 'none',
            border: 'none',
            width: '30px',
            height: '30px',
        }}
    >
        x
    </button>
)

const ws = new WebSocket('ws://localhost:5000/connection')
console.log('***WS***', ws)
function App() {
    const token = readItem('token')
    console.log('APP...')
    ws.onopen = () => console.log('ONLINE')
    ws.onclose = () => console.log('CLOSE')
    ws.onmessage = resp => console.log('SOCKET_RESPONSE', resp.data)
    const test = () => setTimeout(() => ws.send('HEY, GUYS!!!'), 15000)
    test()
    return (
        <OrdersState>
            <ProductState>
                <Fragment>
                    <BrowserRouter>
                        <Switch>
                            <Route key="/header" component={MainNavigation} />
                        </Switch>
                        <Switch>
                            <Route
                                key="/"
                                exact={true}
                                path="/"
                                render={() => <Main/>}
                            />
                            <Route
                                key="/"
                                exact={true}
                                path="/signup"
                                render={() => {
                                    if (!token) {
                                        return <Signup/>
                                    }

                                    return (
                                        <Redirect to="/"/>
                                    )
                                }}
                            />
                            <Route
                                key="/"
                                exact={true}
                                path="/login"
                                render={() => {
                                    if (!token) {
                                        return <Login/>
                                    }

                                    return (
                                        <Redirect to="/"/>
                                    )
                                }}
                            />
                            <Route
                                key="/products"
                                exact={true}
                                path="/products"
                                render={() => <Products/>}
                            />
                            <Route
                                key="/product"
                                exact={true}
                                path="/products/:id"
                                render={() => <Product/>}
                            />
                            <Route
                                key="/orders"
                                exact={true}
                                path="/orders"
                                render={() => {
                                    if (token) {
                                        return <Orders/>
                                    }

                                    return (
                                        <Redirect to="/"/>
                                    )
                                }}
                            />
                            <Route
                                key="/notFound"
                                path="/:notFound+"
                                render={() => {
                                    return <Redirect to="/"/>
                                }}
                            />
                        </Switch>
                    </BrowserRouter>
                    {/* __TEMPORARY__ */}
                    <ToastContainer
                        autoClose={7000}
                        draggablePercent={60}
                        pauseOnFocusLoss={false}
                        closeButton={<CloseButton />}
                    />
                </Fragment>
            </ProductState>
        </OrdersState>
    )
}

export default App
