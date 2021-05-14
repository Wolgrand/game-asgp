import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../../services/fauna";
import { sendEmail } from "../../../../services/mail";

type Solicitation = {
  ref: {
      id: string;
  }
  data: {
    player: {
      email: string,
      role: string,
      name: string,
      image_url: string,
      id:string,
    }
    title: string,
    player_id: string,
    score: string,
    month: string,
    status: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Solicitation[] | any >) => {
   if(req.method === 'PUT'){
    const {
      query: { id },
    } = req;
  
    const { status } = req.body;
  
    try {

      const solicitation = await fauna.query<Solicitation>(
        q.Update(q.Ref(q.Collection('solicitations'), id), {
          data: {
            status,
          },
        })
      );

      const {name, email} = solicitation.data.player
      const {title, score, month} = solicitation.data

      const emailSubject = `A sua solicitação de pontuação foi ${status === 'Aprovado' ? 'aprovada!' : 'reprovada!'}`
      const emailBody = `<strong>Olá, ${name}</strong>
      <p>A sua solicitação de registro de pontuação abaixo foi ${status === 'Aprovado' ? 'aprovada!' : 'reprovada!'}:</p>
      <p>
        <strong>Entrega: </strong> ${title} <br />
        <strong>Pontuação: </strong> ${score} <br />
        <strong>Mês de Referência: </strong> ${month} <br />
        <br />
      </p>`

      sendEmail(
        email,
        emailSubject,
        emailBody
      )

      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'PUT')
    res.status(405).end('Method not allowed')
}
};