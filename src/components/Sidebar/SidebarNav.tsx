import { Stack, Tag } from "@chakra-ui/react";
import { RiSurveyLine, RiDashboardLine, RiErrorWarningLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";
import { useQuery } from "react-query";
import { api } from "../../services/api";
import NavLink from "./NavLink";
import NavSection from "./NavSection";

export default function SidebarNav(){
  const { data, isLoading, error} = useQuery('solicitations', async () => {
    const response = await api.get('/solicitations/pending')
    
    const pendingSolicitations = response.data?.map(solicitations => {
      return {
        id: solicitations['ref']['@ref'].id,
        name: solicitations.data.name,
        email: solicitations.data.email,
        image_url: solicitations.data.image_url,
        score: solicitations.data.score,
      };
    })
    return pendingSolicitations
  })
  return(
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard"> Dashboard </NavLink>
        {/* <NavLink icon={RiContactsLine} href="/users"> Usuários </NavLink> */}
      </NavSection>
      <NavSection title="ENTREGAS">
        <NavLink icon={RiErrorWarningLine} href="/solicitations"> Todas as solicitações </NavLink>
        <NavLink icon={RiSurveyLine} href="/solicitations/pending" tag={data?.length > 0 ? data?.length : "" }> Aguardando aprovação </NavLink>
      </NavSection>h
    </Stack>
  )
}