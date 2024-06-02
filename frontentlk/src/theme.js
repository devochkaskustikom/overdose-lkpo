import './assets/theme.css'
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    fonts: {
      heading: `'Onest Bold', sans-serif`,
      body: `'Onest Regular', sans-serif`,
    },
})
  
export default theme