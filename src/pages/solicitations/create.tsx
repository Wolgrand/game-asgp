import {Flex, Box, Textarea, Heading, Divider, VStack, SimpleGrid, HStack, Button, Select, useToast} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { Input } from '../../components/Form/Input';
import {Header} from '../../components/Header'
import { Sidebar } from '../../components/Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/apiClient';

interface Goal {
  id: string;
  title: string;
  score: string;
  pilar: string;
}

export default function CreateU(){
  const [goal, setGoal] = useState({})
  const toast = useToast()
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [description, setDescription] = useState("")
  const [month, setMonth] = useState("")
  const { data, isLoading, error} = useQuery('goals', async () => {
    const response = await api.get('/goals')
    
    const goals:Goal[] = response.data?.map(goal => {
      return {
        id: goal['ref']['@ref'].id,
        title: goal.data.title,
        score: goal.data.score,
        pilar: goal.data.pilar,
      };
    })
    return goals.sort((a,b) => (a.title > b.title) ? 1 : -1);
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const selectedGoal = (data.filter((item)=> item.title === goal))

    const newSolicitation = {
      title: selectedGoal[0].title,
      score: selectedGoal[0].score,
      pilar: selectedGoal[0].pilar,
      description,
      month,
      player: user
    }
    
    await api.post('/solicitations/new', newSolicitation).then(response => toast({
      title: "Solicitação criada com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    }) ).catch(error => toast({
      title: "Erro na solicitação.",
      description: "Tente novamente mais tarde.",
      status: "error",
      duration: 9000,
      isClosable: true,
    }))
    
    router.push('/solicitations/my-solicitations')

    return;
  }
  
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          flex="1"
          borderRadius={8}
          bg="white"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">Criar nova solicitação</Heading>

          <Divider my="6" borderColor="gray.700"/>
          <Flex
            as="form"
            onSubmit={handleSubmit}
          >
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
            <Select placeholder="Selecione a entrega" onChange={e => setGoal(e.target.value)}>
              {data && data.map(item => (
                <option key={item.id} value={item.title}>{item.title} - {item.score}pts</option>  
              ))}
            </Select>
            <Select placeholder="Selecione o mês de referência" onChange={e => setMonth(e.target.value)}> 
                <option key={'Abril'} value={'Abril'}>Abril</option>  
                <option key={'Maio'} value={'Maio'}>Maio</option>  
                <option key={'Junho'} value={'Junho'}>Junho</option>  
                <option key={'Julho'} value={'Julho'}>Julho</option>  
                <option key={'Agosto'} value={'Agosto'}>Agosto</option>  
                <option key={'Setembro'} value={'Setembro'}>Setembro</option>  
                <option key={'Outubro'} value={'Outubro'}>Outubro</option>  
                <option key={'Novembro'} value={'Novembro'}>Novembro</option>  
            </Select>
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Textarea onChange={e => setDescription(e.target.value)} placeholder="Descrever detalhes da entrega e as devidas evidências. Ex.: Curso realizada na data dd/mm com o conteúdo..." />
            </SimpleGrid>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link  href="/dashboard" passHref>
                <Button as="a" colorScheme="red">Cancelar</Button>
              </Link>
              <Button colorScheme="green" type="submit">Salvar</Button>
            </HStack>
          </Flex>
          </VStack>

          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}