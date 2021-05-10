import {Flex, Heading, Spinner, useToast , Icon, HStack, Tag, Avatar, Table, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiCheckFill, RiCloseFill, RiPencilLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import {Header} from '../../components/Header'
import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/apiClient';
import players from '../api/players';

type Solicitation = {
  id: string,
  title: string,
  score: number,
  month: string,
  status: string,
  description: string,
  player: {
    id: string
    name: string
    image_url: string
    score: number
  },
}


export default function UserList(){
  const toast = useToast()
  const { data, isLoading, error} = useQuery('solicitations', async () => {
    const response = await api.get('/solicitations/pending')
    
    const solicitations = response.data?.map(solicitation => {
      return {
        id: solicitation['ref']['@ref'].id,
        title: solicitation.data.title,
        score: solicitation.data.score,
        month: solicitation.data.month,
        status: solicitation.data.status,
        player: solicitation.data.player,
      };
    })
    return solicitations.sort((a,b) => (a.month > b.month) ? 1 : -1);
  })
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  function handleSolicitationApproval(solicitation:Solicitation) {
    api.put(`/solicitations/approval/${solicitation.id}`, {
      status: "Aprovado"
    })

    toast({
      title: "Solcitação aprovada com sucesso",
      status: "success",
      position:"top-right",
      duration: 3000,
      isClosable: true,
    })

    console.log(solicitation.player)

    api.put(`/user/update-score/${solicitation.player.id}`, {
      score: solicitation.score
    })

    
  }
  function handleSolicitationRepproval(solicitation:Solicitation) {
    api.put(`/solicitations/approval/${solicitation.id}`, {
      status: "Reprovado"
    })
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
              p="8"
              shadow="md"
            >
              <Flex
                mb="8"
                justify="space-between"
                align="center"
              >
                <Heading size="lg" fontWeight="normal" color="gray.600">Solicitações Pendentes</Heading>

                
              </Flex>
              <Table colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Jogador</Th>
                    <Th textAlign="center">Entrega</Th>
                    <Th textAlign="center">Pontuação</Th>
                    <Th textAlign="center">Mês</Th>
                    <Th w="8" textAlign="center">Ação</Th>
                  </Tr>
                </Thead>
                <Tbody>
                { isLoading ?
                    <Flex justify="center">
                      <Spinner />
                    </Flex>
                  : error ? (
                    <Flex justify="center">
                      <Text>Erro ao carregar os dados.</Text>
                    </Flex>
                  ) : (data?.map(solicitation=>(
                    
                    <Tr key={solicitation.id} cursor="pointer" _hover={
                      {shadow: "md",
                        
                      }
                    }>
                      <Td>
                        <Flex flexDir="row" alignContent="center" align="center">
                          <Avatar size="md" name={solicitation.player?.name} src={solicitation.player?.image_url}/>
                        </Flex>
                      </Td>
                      <Td>{solicitation.title}</Td>
                      <Td textAlign="center">{solicitation.score}</Td>
                      <Td alignContent="center" justifyContent="center">
                      {solicitation.month}
                      </Td>
                      <Td>
                        <HStack>
                          <Button
                            as="a"
                            size="sm"
                            fontSize="sm"
                            color="white"
                            colorScheme="green"
                            shadow="md"
                            onClick={()=>handleSolicitationApproval(solicitation)}
                          >
                            <Icon as={RiCheckFill} fontSize="16"/>
                          </Button>
                          <Button
                            as="a"
                            size="sm"
                            fontSize="sm"
                            color="white"
                            colorScheme="red"
                            shadow="md"
                            onClick={()=>handleSolicitationRepproval(solicitation)}
                          >
                            <Icon as={RiCloseFill} fontSize="16"/>
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))) } 
                    
                  
                  
                </Tbody> 
              </Table>
              
            </Box>
      </Flex>
    </Box>
  )
}