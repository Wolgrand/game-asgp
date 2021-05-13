import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({ // Configura os parâmetros de conexão com servidor.
  host: 'smtp.umbler.com',
  port: 587,
  secure: false,
  auth: {
    user: 'game-asgp@wowstudios.com.br',
    pass: process.env.EMAIL_SERVICE_PASS
  }
})

export function sendEmail(to: string, subject: string, body:string) {

  const text = `
  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-heigth:1.6; color:#222; max-width: 600px">
    ${body}
    
    <br />
    Equipe Game ASGP
  </div>`

  const emailData = {
    from: 'Game ASGP <game-asgp@wowstudios.com.br>',
    to,
    subject,
    html: text,
  }



  transporter.sendMail(emailData, (err, info) => { // Função que, efetivamente, envia o email.
    if (err) {
      return console.log(err)
    }
    
    console.log(info)
  })

}