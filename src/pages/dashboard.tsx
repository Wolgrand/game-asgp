import { GetServerSideProps } from "next"
import {Flex, VStack,  Button,Box,Heading,Text, Stack, SimpleGrid, theme, Spinner} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import { Card } from '../components/Card';
import {Header} from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { api } from "../services/api";
import { useQuery } from "react-query";
import { Ref } from "faunadb";

type Player = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    image_url: string,
    role: string,
    score: number,
    score_extract:[]
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
  const { data, isLoading, error} = useQuery('players', async () => {
    const response = await fetch('http://localhost:3000/api/players')
    const data = await response.json()

    const players = data?.map(player => {
      return {
        id: player['ref']['@ref'].id,
        name: player.data.name,
        email: player.data.email,
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
            <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
              <Heading>Pontuação geral - Abril</Heading>
            </SimpleGrid>
            <SimpleGrid flex="1" gap="4" minChildWidth="480px" align="flex-start">
                { isLoading ?
                <Flex justify="center">
                  <Spinner />
                </Flex>
              : error ? (
                <Flex justify="center">
                  <Text>Erro ao carregar os dados.</Text>
                </Flex>
              ) : (data.map(player=>(
                <Card key={player.name} email={player.email} name={player.name} score={player.score}  image={player.image_url} />
              ))) }  
            </SimpleGrid>
          </Stack>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}


