import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../../services/fauna";
import { sendEmail } from "../../../../services/mail";

type Solicitation = {
  ref: {
      id: string;
  },
  ts: string,
  data: {
    title: string,
    player: {
      id: string,
      name: string,
      image_url: string
    },
    score: string,
    month: string,
    description: string;
    status: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Solicitation[] | any >) => {
  if(req.method === 'POST'){
    const { player, title, score, month, description } = req.body;
    try {
      const solicitation = await fauna.query<Solicitation>(
        q.Create(q.Collection('solicitations'), {
          data: {
            player,
            title,
            score,
            month,
            description,
            status: 'Aguardando aprovação'
          },
        })
      );

      const {name, email} = player
      const date = new Date(solicitation.ts).toLocaleDateString("pt-BR")

      const emailSubject = `Nova solicitação de pontuação está aguardando aprovação`
      const emailBody = `<strong>Olá, Wolgrand</strong>
      
      <p>${name} está solicitou em ${date} o registro da pontuação para a seguinte entrega: </p>
      <p>
        <strong>Entrega: </strong> ${title} <br />
        <strong>Pontuação: </strong> ${score} <br />
        <strong>Mês de Referência: </strong> ${month} <br />
        <strong>Detalhamento: </strong> ${description} <br />

        <a href="https://game-asgp.vercel.app/solicitations/pending" target="_blank">Clique aqui para visualizar</a>
        <br />
      </p>`

      sendEmail(
        'wolgrand.lordao@energisa.com.br',
        emailSubject,
        emailBody
      )
      // ok
      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
}
};