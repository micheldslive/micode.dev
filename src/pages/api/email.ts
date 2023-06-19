import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { emailSchema } from '@/src/schemas';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function SendMail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { success } = emailSchema.safeParse(req.body);
      if (!success) return;

      const data = req.body;

      await resend.emails.send({
        from: data.name,
        to: String(process.env.RESEND_EMAIL_USER),
        subject: `${data.name} - via micode-dev`,
        html: `<p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p>${data.message}</p>`
      });

      return res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
