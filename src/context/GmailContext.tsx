import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { sendEmail as gmailServiceSend } from '../services/gmail';

interface GmailContextType {
    isConnected: boolean;
    accessToken: string | null;
    login: () => void;
    sendNotification: (to: string, subject: string, htmlContent: string) => Promise<boolean>;
    sendAdminReport: (action: string, details: string) => Promise<boolean>;
}

const GmailContext = createContext<GmailContextType | undefined>(undefined);

export function GmailProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('gmail_token'));

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setAccessToken(tokenResponse.access_token);
            localStorage.setItem('gmail_token', tokenResponse.access_token);
        },
        scope: 'https://www.googleapis.com/auth/gmail.send',
    });

    const sendNotification = async (to: string, subject: string, htmlContent: string) => {
        if (!accessToken) return false;

        const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #7c3aed; margin: 0;">Gestão de Projetos</h1>
        </div>
        ${htmlContent}
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          © 2026 Gestão de Projetos. Sistema de Elite.
        </p>
      </div>
    `;

        try {
            await gmailServiceSend(accessToken, to, subject, emailBody);
            return true;
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            return false;
        }
    };

    const sendAdminReport = async (action: string, details: string) => {
        // Definimos os e-mails dos administradores principais baseado no AuthContext anterior
        const adminEmails = ['vytor@designflow.com', 'kaian@designflow.com'];

        const htmlContent = `
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">
        <h3 style="color: #1f2937; margin-top: 0;">Relatório de Atividade Administrativa</h3>
        <p><strong>Ação:</strong> ${action}</p>
        <p><strong>Detalhes:</strong> ${details}</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `;

        let allSuccess = true;
        for (const email of adminEmails) {
            const success = await sendNotification(email, `REPORT: ${action}`, htmlContent);
            if (!success) allSuccess = false;
        }
        return allSuccess;
    };

    return (
        <GmailContext.Provider value={{
            isConnected: !!accessToken,
            accessToken,
            login,
            sendNotification,
            sendAdminReport
        }}>
            {children}
        </GmailContext.Provider>
    );
}

export function useGmail() {
    const context = useContext(GmailContext);
    if (context === undefined) {
        throw new Error('useGmail must be used within a GmailProvider');
    }
    return context;
}
