import {Flex, Select, Avatar, Skeleton, SkeletonText, SkeletonCircle, CircularProgress, CircularProgressLabel, Badge, Heading, Spinner, Icon, Table, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue, ProgressLabel, Tag} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import { Card } from '../components/Card';
import {Header} from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { api } from "../services/apiClient";
import { useQuery } from "react-query";
import React, { useContext } from 'react';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { AuthContext } from '../contexts/AuthContext';
import { withSSRAuth } from '../utils/withSSRAuth';
import { setupApiClient } from '../services/api';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { destroyCookie } from 'nookies';
import { useState } from 'react';

type Player = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    image_url: string,
    role: string,
    score: number,
    score_extract:{
      Abril: number,
      Maio: number,
      Junho: number,
      Julho: number,
      Agosto: number,
      Setembro: number,
      Outubro: number,
      Novembro: number
    }
  }
}

const  Chart = dynamic(() => import('react-apexcharts'), {
  ssr:false,
})

const options = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      '2021-03-18T00:00:00.0000Z',
      '2021-03-19T00:00:00.0000Z',
      '2021-03-20T00:00:00.0000Z',
      '2021-03-21T00:00:00.0000Z',
      '2021-03-22T00:00:00.0000Z',
      '2021-03-23T00:00:00.0000Z',
      '2021-03-24T00:00:00.0000Z',
    ]
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    } 
  }
};

const series = [
  { name: 'series1', data: [31, 120, 10, 28, 61, 18, 109]}
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('Novembro')
  const { data, isLoading, error} = useQuery('players', async () => {
    const response = await api.get('/players')
    
    const players = response.data?.map(player => {
      return {
        id: player['ref']['@ref'].id,
        name: player.data.name,
        email: player.data.email,
        score_extract: player.data.score_extract,
        image_url: player.data.image_url,
        score: player.data.score,
      };
    })
    return players.sort((a,b) => (a.name > b.name) ? 1 : -1);
  })


  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start" mb="6">
          <Stack spacing={4}>
            {/* <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
              <Heading>Pontuação geral - Abril</Heading>
            </SimpleGrid> */}

            <SimpleGrid>
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
                <Heading size="lg" fontWeight="normal" color="gray.600">Pontuação geral - {selectedMonth}</Heading>
                <Select w="fit-content" placeholder="Selecione o mês de referência" onChange={e=> setSelectedMonth(e.target.value)}> 
                  <option key={'Abril'} value={'Abril'}>Abril</option>  
                  <option key={'Maio'} value={'Maio'}>Maio</option>  
                  <option key={'Junho'} value={'Junho'}>Junho</option>  
                  <option key={'Julho'} value={'Julho'}>Julho</option>  
                  <option key={'Agosto'} value={'Agosto'}>Agosto</option>  
                  <option key={'Setembro'} value={'Setembro'}>Setembro</option>  
                  <option key={'Outubro'} value={'Outubro'}>Outubro</option>  
                  <option key={'Novembro'} value={'Novembro'}>Novembro</option>  
                </Select>
              </Flex>
              <Table colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Jogador</Th>
                    <Th>Pontuação total</Th>
                    <Th>Pontuação no Mês</Th>
                    <Th>Progresso Mês</Th>
                    <Th>Recompensa</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { isLoading ?
                    <>
                    <Tr cursor="pointer" _hover={
                      {shadow: "md",
                        
                      }
                    }>
                      <Td>
                        <Flex flexDir="row" alignContent="center" align="center">
                          <SkeletonCircle size="10" />
                          <Box ml="4" textAlign="left">
                            <Skeleton height="10px" />
                            <Skeleton height="10px" />
                          </Box>
                        </Flex>
                      </Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td alignContent="center" justifyContent="center">
                        <SkeletonCircle size="10" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
  
                        <Text as="span" color="gray.500" fontSize="16" ></Text>
                      </Td>
                    </Tr>
                    <Tr cursor="pointer" _hover={
                      {shadow: "md",
                        
                      }
                    }>
                      <Td>
                        <Flex flexDir="row" alignContent="center" align="center">
                          <SkeletonCircle size="10" />
                          <Box ml="4" textAlign="left">
                            <Skeleton height="10px" />
                            <Skeleton height="10px" />
                          </Box>
                        </Flex>
                      </Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td alignContent="center" justifyContent="center">
                        <SkeletonCircle size="10" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
  
                        <Text as="span" color="gray.500" fontSize="16" ></Text>
                      </Td>
                    </Tr>
                    <Tr cursor="pointer" _hover={
                      {shadow: "md",
                        
                      }
                    }>
                      <Td>
                        <Flex flexDir="row" alignContent="center" align="center">
                          <SkeletonCircle size="10" />
                          <Box ml="4" textAlign="left">
                            <Skeleton height="10px" />
                            <Skeleton height="10px" />
                          </Box>
                        </Flex>
                      </Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td alignContent="center" justifyContent="center">
                        <SkeletonCircle size="10" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
  
                        <Text as="span" color="gray.500" fontSize="16" ></Text>
                      </Td>
                    </Tr>
                    </>
                  : data?.map(player=>(
                    
                  <Tr cursor="pointer" _hover={
                    {shadow: "md",
                      
                    }
                  }>
                    <Td>
                      <Flex flexDir="row" alignContent="center" align="center">
                        <Avatar size="md" name={player.name} src={player.image_url}/>
                        <Box ml="4" textAlign="left">
                          <Text color="gray.700" fontWeight="bold">{player.name}</Text>
                          <Text color="gray.300" fontSize="small">{player.email}</Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td>{player.score}</Td>
                    <Td>{player.score_extract[selectedMonth]}</Td>
                    <Td alignContent="center" justifyContent="center">
                      <CircularProgress size="64px" flex="1" thickness="16"  min={0} max={100} value={(player.score_extract[selectedMonth]/320)*100} color={player.score_extract[selectedMonth] >= 320 ? "green" : "orange"}>
                        <CircularProgressLabel textAlign="center" fontSize="sm" >{((player.score_extract[selectedMonth]/320)*100).toLocaleString('pt-BR', { maximumFractionDigits: 0})}%</CircularProgressLabel>
                      </CircularProgress>
                    </Td>
                    <Td>
                    <Tag colorScheme={player.score_extract[selectedMonth] >= 320 ? "green" : "gray"}>{player.score_extract[selectedMonth]>= 1000 ? "Chocolate" : player.score_extract[selectedMonth] >= 320 ? "habilitado" : "não habilitado"}</Tag>

                      <Text as="span" color="gray.500" fontSize="16" ></Text>
                    </Td>
                  </Tr>
                  )) } 
                </Tbody> 
              </Table>
              
            </Box>
            </SimpleGrid>
          </Stack>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  //const apiClient = setupApiClient(ctx);
  //const response = await apiClient.get('/me')

  
  return {
   props: {}
 }
})

