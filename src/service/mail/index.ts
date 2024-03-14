import nodemailer, { TransportOptions } from "nodemailer"
import handlebars from "handlebars"

const systemMail = process.env.SYSTEM_MAIL
const systemMailPass = process.env.SYSTEM_MAIL_PASS

// MS Exchange mail server connect
import nodemailerNTLMAuth from 'nodemailer-ntlm-auth'

async function renderHTMLfromTemplateWithData(source, data) {
  const template = await handlebars.compile(source)
  return await template(data)
}

export async function sendMail({ to, subject, template, data }) {
  if (!template)
    return "Fail to get template"
  const htmlToSend = await renderHTMLfromTemplateWithData(template, data)
  const mailOption = {
    from: `<${systemMail}>`,
    to, // "bar@example.com, baz@example.com"
    subject, // "Hello ✔" Subject line
    html: htmlToSend, // html body
  }
  let info
  try {
    var transporter = nodemailer.createTransport({
      port: 587,
      host: '10.1.10.32',
      auth: {
        user: systemMail,
        pass: systemMailPass,
        type: 'custom',
        method: 'NTLM',
      },
      customAuth: {
        NTLM: nodemailerNTLMAuth
      }
    } as TransportOptions);
    info = await transporter.sendMail(mailOption)
  }
  catch (e) {
    console.error(e)
  }
  return info
}
