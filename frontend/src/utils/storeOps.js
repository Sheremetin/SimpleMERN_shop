import Cookies from 'js-cookie'

export const readItem = key => Cookies.get(key)
export const deleteItem = name => Cookies.remove(name)

export const writeItem = (name, val) => Cookies.set(name, val)
