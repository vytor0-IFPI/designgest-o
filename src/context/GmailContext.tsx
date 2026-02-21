import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { sendEmail as gmailServiceSend } from '../services/gmail';

interface GmailContextType {
    isConnected: boolean;
    accessToken: string | null;
    login: () => void;
    logout: () => void;
    sendNotification: (to: string, subject: string, htmlContent: string) => Promise<{ success: boolean; error?: string }>;
    sendAdminReport: (action: string, details: string) => Promise<boolean>;
}

const GmailContext = createContext<GmailContextType | undefined>(undefined);

export function GmailProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('gmail_token'));

    const handleLogout = () => {
        setAccessToken(null);
        localStorage.removeItem('gmail_token');
    };

    let googleLogin;
    try {
        googleLogin = useGoogleLogin({
            onSuccess: (tokenResponse) => {
                setAccessToken(tokenResponse.access_token);
                localStorage.setItem('gmail_token', tokenResponse.access_token);
            },
            onError: (error) => {
                console.error("Erro ao autorizar Google:", error);
            },
            scope: 'https://www.googleapis.com/auth/gmail.send',
        });
    } catch (e) {
        googleLogin = () => console.error("Google Login não disponível no momento.");
    }

    const sendNotification = async (to: string, subject: string, htmlContent: string) => {
        if (!accessToken) {
            return { success: false, error: 'Gmail não conectado. Clique em "Conectar Gmail" no topo.' };
        }

        const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px; background-color: #ffffff; color: #1f2937;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #7c3aed; padding-bottom: 15px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">Elite Design System</h1>
        </div>
        <div style="line-height: 1.6; font-size: 16px;">
            ${htmlContent}
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-t: 1px solid #eee; text-align: center;">
          <p style="font-size: 12px; color: #9ca3af;">
            © 2026 Elite Management • Este é um e-mail automático.
          </p>
        </div>
      </div>
    `;

        try {
            await gmailServiceSend(accessToken, to, subject, emailBody);
            return { success: true };
        } catch (error: any) {
            console.error('Falha no envio do e-mail:', error);

            if (error.message === 'TOKEN_EXPIRED') {
                handleLogout();
                return { success: false, error: 'Sua conexão com o Gmail expirou. Por favor, conecte novamente.' };
            }

            return { success: false, error: error.message || 'Erro inesperado ao enviar e-mail.' };
        }
    };

    const sendAdminReport = async (action: string, details: string) => {
        const adminEmails = ['vytor@designflow.com', 'kaian@designflow.com'];
        const htmlContent = `
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; border-left: 4px solid #7c3aed;">
            <h3 style="color: #111827; margin-top: 0;">Relatório de Auditoria</h3>
            <p style="margin: 8px 0;"><strong>Ação:</strong> ${action}</p>
            <p style="margin: 8px 0;"><strong>Impacto:</strong> ${details}</p>
            <p style="margin: 8px 0; font-size: 12px; color: #6b7280;">Timestamp: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        `;

        let results = await Promise.all(
            adminEmails.map(email => sendNotification(email, `Audit Log: ${action}`, htmlContent))
        );
        return results.every(r => r.success);
    };

    return (
        <GmailContext.Provider value={{
            isConnected: !!accessToken,
            accessToken,
            login: googleLogin,
            logout: handleLogout,
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
