import {Text, Image} from '@chakra-ui/react'

export default function Logo(){
  return (
    <Image
      src="/logo.png"
      borderRadius="full"
      boxSize="56px"
      mb="2"
    />
  )
}