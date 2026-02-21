import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { sendEmail } from '../services/gmail';

export function useGmail() {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('gmail_token'));

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setAccessToken(tokenResponse.access_token);
            localStorage.setItem('gmail_token', tokenResponse.access_token);
        },
        scope: 'https://www.googleapis.com/auth/gmail.send',
    });

    const sendProjectUpdate = async (clientEmail: string, projectName: string, status: string) => {
        if (!accessToken) {
            login();
            return;
        }

        const subject = `Atualização de Projeto: ${projectName}`;
        const message = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #7c3aed;">Olá!</h2>
        <p>Gostaríamos de informar que seu projeto <strong>${projectName}</strong> teve uma atualização de status.</p>
        <p><strong>Novo Status:</strong> ${status}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">Este é um e-mail automático do sistema Gestão de Projetos.</p>
      </div>
    `;

        try {
            await sendEmail(accessToken, clientEmail, subject, message);
            return true;
        } catch (error) {
            console.error('Erro no hook useGmail:', error);
            // Se o token expirou, tenta login novamente
            login();
            return false;
        }
    };

    return {
        isConnected: !!accessToken,
        login,
        sendProjectUpdate
    };
}
