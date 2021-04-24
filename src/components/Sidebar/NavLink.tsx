import { Text, Link as ChakraLink, Icon, Tag, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { ElementType } from "react";
import Link from 'next/link'

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType;
  children:string;
  href:string;
  tag?:string;
}

export default function NavLink({icon, children, tag, href,  ...rest}:NavLinkProps){
  return (
    <Link href={href} passHref>
      <ChakraLink display="flex" align="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">{children}</Text>
        { tag && 
          <Tag
            bg="orange.500"
            color="white"
            borderRadius="full"
            ml="1"
            size="sm"
          >
            {tag}
          </Tag>}
      </ChakraLink>
    </Link>
  )
}