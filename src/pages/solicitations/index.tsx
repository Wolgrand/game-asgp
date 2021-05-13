import {Flex, Heading, Spinner, Icon, HStack, Tag, Avatar, Table, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiCheckFill, RiCloseFill, RiPencilLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import {Header} from '../../components/Header'
import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/apiClient';
import { withSSRAuth } from '../../utils/withSSRAuth';

export default function PendingSolicitationList(){
  const { data, isLoading, error} = useQuery('all_solicitations', async () => {
    const response = await api.get('/solicitations')
    
    const all_solicitations = response.data?.map(solicitation => {
      return {
        id: solicitation['ref']['@ref'].id,
        title: solicitation.data.title,
        score: solicitation.data.score,
        month: solicitation.data.month,
        status: solicitation.data.status,
        description: solicitation.data.description,
        player: solicitation.data.player,
      };
    })
    return all_solicitations.sort((a,b) => (a.month > b.month) ? 1 : -1);
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
                <Heading size="lg" fontWeight="normal" color="gray.600">Todas Solicitações</Heading>

                
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
                  ) : (data.map(solicitation=>(
                    
                    <Tr cursor="pointer" _hover={
                      {shadow: "md",
                        
                      }
                    }>
                      <Td>
                        <Flex flexDir="row" alignContent="center" align="center">
                          <Avatar size="md" name={solicitation.player?.name} src={solicitation.player?.image_url}/>
                        </Flex>
                      </Td>
                      <Td>
                        <Box flexDir="row">
                          <Text fontSize="smaller" mb="2" fontWeight="bold">{solicitation.title}</Text>                  
                          <Text >{solicitation.description}</Text>                  
                        </Box>
                      </Td>
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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  //const apiClient = setupApiClient(ctx);
  //const response = await apiClient.get('/me')

  
  return {
   props: {}
 }
})
