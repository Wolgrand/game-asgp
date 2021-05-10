import Head from 'next/head'
import {Input} from '../components/Form/Input'
import {Flex, Button, Stack, Image, Box, Center} from '@chakra-ui/react'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {parseCookies} from 'nookies'
import { AuthContext } from '../contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { withSSRGuest } from '../utils/withSSRGuest'


export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useContext(AuthContext)
  
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const data = {
      email,
      password,
    }

    await signIn(data)
  }
  
  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="white"
        p="8"
        borderRadius={8}
        flexDir="column"
        color="gray.600"
        onSubmit={handleSubmit}
      >
        
          <Center>
            <Image src="/logo.png" alt="Game ASGP"/>
          </Center> 
        
        <Stack spacing="4">
          <Input type="email" value={email} name="email" label="E-mail" onChange={e => setEmail(e.target.value)} />
          <Input type="password" value={password} name="password" label="Senha" onChange={e => setPassword(e.target.value)} />   
        </Stack>
        
        <Button
          type="submit"
          mt="6"
          colorScheme="orange"
          size='lg'
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
   return {
    props: {}
  }
})
