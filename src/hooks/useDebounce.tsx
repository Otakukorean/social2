import {useEffect,useState} from 'react'

function useDebounce(value : any ,delay : number) {
     const [debouncdValue,setDebouncdValue] = useState(value)


     useEffect(() => {
               const handler = setTimeout(() => {
                    setDebouncdValue(value)
               },delay)

               return () => {
                    clearTimeout(handler)
               }
     },[value,delay])


     return debouncdValue
}

export default useDebounce