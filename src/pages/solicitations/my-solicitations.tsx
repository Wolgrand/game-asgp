import {Flex, Heading, Spinner, Icon, HStack, Tag, Avatar, Table, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useContext } from 'react';
import { RiAddLine, RiCheckFill, RiCloseFill, RiPencilLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import {Header} from '../../components/Header'
import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/apiClient';

interface Solicitation {
  data: {
    id: string,
    title: string,
    score: string,
    month: string,
    description: string,
    status: string,
    player: {
      id: string,
      name: string,
      image_url: string,
    },
  }
}

export default function PendingSolicitationList(){
  
  const { data, isLoading, error} = useQuery('solicitations', async () => {
    const response = await api.get<Solicitation[]>(`/solicitations/my-solicitations`)
    
    const solicitations = response.data?.map(solicitation => {
      return {
        id: solicitation['ref']['@ref'].id,
        title: solicitation.data.title,
        score: solicitation.data.score,
        month: solicitation.data.month,
        description: solicitation.data.description,
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
                <Heading size="lg" fontWeight="normal" color="gray.600">Minhas Solicitações</Heading>
                <Link  href="/solicitations/create" passHref>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme="orange"
                    leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
                  >
                    Criar nova
                  </Button>
                </Link>
                
              </Flex>
              <Table colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Jogador</Th>
                    <Th textAlign="center">Entrega</Th>
                    <Th textAlign="center">Pontuação</Th>
                    <Th textAlign="center">Mês</Th>
                    <Th textAlign="center">Status</Th>
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
                      <Td textAlign="center">
                        <Tag  fontSize="small" colorScheme={solicitation.status==="Aprovado" ? "green" : solicitation.status==="Reprovado" ? "red" : "gray"} >{solicitation.status}</Tag>
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