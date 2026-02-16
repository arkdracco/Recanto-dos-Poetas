import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email, name, verificationLink) => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Bem-vindo ao Recanto dos Poetas! 📚</h2>
          
          <p>Olá ${name},</p>
          
          <p>Obrigado por se cadastrar! Para completar seu registro, clique no link abaixo para verificar seu email:</p>
          
          <p style="margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verificar Email
            </a>
          </p>
          
          <p style="color: #666; font-size: 12px;">
            Ou copie e cole este link no seu navegador:<br/>
            ${verificationLink}
          </p>
          
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            Este link expira em 24 horas.<br/>
            © 2024 Recanto dos Poetas - Todos os direitos reservados
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: '✅ Verifique seu email - Recanto dos Poetas',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, name, resetLink) => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Redefinir Sua Senha 🔐</h2>
          
          <p>Olá ${name},</p>
          
          <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo:</p>
          
          <p style="margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Redefinir Senha
            </a>
          </p>
          
          <p style="color: #666; font-size: 12px;">
            Este link expira em 1 hora.<br/>
            Se você não solicitou esta alteração, ignore este email.
          </p>
          
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            © 2024 Recanto dos Poetas - Todos os direitos reservados
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: '🔐 Redefinir Senha - Recanto dos Poetas',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de reset:', error);
    return false;
  }
};

export const sendLicensePurchaseEmail = async (buyerEmail, buyerName, textTitle, authorName, licenseType, amount) => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Compra de Licença Confirmada ✅</h2>
          
          <p>Olá ${buyerName},</p>
          
          <p>Sua compra foi processada com sucesso!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Texto:</strong> ${textTitle}</p>
            <p><strong>Autor:</strong> ${authorName}</p>
            <p><strong>Tipo de Licença:</strong> ${licenseType}</p>
            <p><strong>Valor:</strong> R$ ${(amount / 100).toFixed(2)}</p>
          </div>
          
          <p>Sua licença foi anexada a este email. Guarde-a com segurança!</p>
          
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            © 2024 Recanto dos Poetas - Todos os direitos reservados
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: buyerEmail,
      subject: `✅ Licença Adquirida - ${textTitle}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de compra:', error);
    return false;
  }
};

export const sendAuthorPayoutEmail = async (email, name, amount, status) => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Seu Pagamento foi Processado 💰</h2>
          
          <p>Olá ${name},</p>
          
          <p>Seu pagamento foi processado com sucesso!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Valor:</strong> R$ ${(amount / 100).toFixed(2)}</p>
            <p><strong>Status:</strong> ${status === 'completed' ? 'Concluído' : 'Processando'}</p>
          </div>
          
          <p>O dinheiro deve aparecer na sua conta em 1-2 dias úteis.</p>
          
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            © 2024 Recanto dos Poetas - Todos os direitos reservados
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: '💰 Seu Pagamento foi Processado - Recanto dos Poetas',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de pagamento:', error);
    return false;
  }
};

export const sendContactNotificationEmail = async (authorEmail, authorName, buyerName, buyerEmail, textTitle) => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Nova Solicitação de Licença 📬</h2>
          
          <p>Olá ${authorName},</p>
          
          <p>${buyerName} está interessado em adquirir uma licença especial para seu texto "${textTitle}".</p>
          
          <p><strong>Email do interessado:</strong> ${buyerEmail}</p>
          
          <p>Responda diretamente para discutir os termos da licença.</p>
          
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            © 2024 Recanto dos Poetas - Todos os direitos reservados
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: authorEmail,
      subject: `📬 Nova Solicitação de Licença - ${textTitle}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de notificação:', error);
    return false;
  }
};
