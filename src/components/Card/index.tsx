import {Box,Flex,Text, Avatar, Progress, Center, CircularProgress, CircularProgressLabel, HStack, VStack} from '@chakra-ui/react'

interface CardProps {
  name:string;
  email:string;
  image?:string;
  score: number
}

export function Card({name, image, score, email}:CardProps){
  return (
    <Box
      p={["6"]}
      bg="white"
      borderRadius={8}
      pb="4"
      shadow="lg"
      cursor="pointer"
      _hover={
        {bg:"gray.50"}
      }
    >
      <HStack justifyContent="space-evenly">

      <VStack>

        <Flex align="center">
        <Avatar size="md" name={name} src={image}/>
          <Box ml="4" textAlign="left">
            <Text color="gray.700" fontWeight="bold">{name}</Text>
            <Text color="gray.300" fontSize="small">{email}</Text>
          </Box>
        </Flex>
      </VStack>

        <VStack>
          <Text color="gray.700" fontWeight="bold" fontSize="48" mr="4" pt="4">{score}<Text as="span" color="gray.500 " fontWeight="bold" fontSize="24">pts</Text></Text>
        </VStack>
      </HStack>
      <HStack>

      <Box
        px="14"
        flex="1"
        py="2"        
      >


        <Text mb={1} color="gray.700" fontSize="12" fontWeight="bold" >{score}<Text as="span" color="gray.700" fontSize="12" >pts </Text>de 320<Text as="span" color="gray.700" fontSize="12" >pts</Text></Text>

        <Progress value={score >= 320 ? 100 : (score/320)*100} colorScheme="orange" size="md" />
      </Box>


      <Text color="gray.700" fontSize="16" fontWeight="bold" align="center">Recompensa: <Text as="span" color="gray.500" fontSize="16" >{score>= 1000 ? "Chocolate" : score >= 320 ? "habilitado" : "não habilitado"}</Text></Text>

      </HStack>
    </Box>
  )
}