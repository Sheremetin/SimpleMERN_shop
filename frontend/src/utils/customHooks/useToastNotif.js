import { useCallback } from 'react'
import { toast } from 'react-toastify'

export const useToastNotif = () => {
    return useCallback((textMsg) => {
        console.log('NOTIF...', textMsg)
        if (textMsg) {
            toast(<div>{textMsg}</div>, {
                type: toast.TYPE.DEFAULT,
                position: toast.POSITION.BOTTOM_LEFT,
                className: 'toast'
            })
        }
    }, [])
}
