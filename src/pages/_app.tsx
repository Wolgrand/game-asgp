import {AppProps} from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import { theme } from '../styles/theme'
import {SidebarDrawerProvider} from '../contexts/SidebarDrawerContext'
import {QueryClient, QueryClientProvider} from 'react-query'


const queryClient = new QueryClient()

function MyApp({ Component, pageProps }:AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp
