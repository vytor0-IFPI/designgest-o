import { gapi } from 'gapi-script';

const SCOPES = 'https://www.googleapis.com/auth/gmail.send';

export const sendEmail = async (accessToken: string, to: string, subject: string, message: string) => {
    const email = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        message,
    ].join('\n');

    const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                raw: base64EncodedEmail,
            }),
        });

        if (!response.ok) {
            throw new Error('Falha ao enviar e-mail');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
    }
};
