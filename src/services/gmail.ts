export const sendEmail = async (accessToken: string, to: string, subject: string, message: string) => {
    // Gmail API requires RFC 5322 format for the raw message
    // Using \r\n as line endings is required by the standard
    const emailHeader = [
        `From: me`,
        `To: <${to}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        ''
    ].join('\r\n');

    const email = emailHeader + message;

    // Helper to safely encode to base64url
    const base64url = (str: string) => {
        // Use TextEncoder to handle UTF-8 properly (handles emojis and special chars)
        const bytes = new TextEncoder().encode(str);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const raw = base64url(email);

    try {
        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ raw }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erro detalhado da API do Gmail:', errorData);

            if (response.status === 401) {
                throw new Error('TOKEN_EXPIRED');
            }

            const message = errorData.error?.message || 'Erro de comunicação com o servidor do Google.';
            throw new Error(message);
        }

        return await response.json();
    } catch (error) {
        console.error('Falha crítica no envio de e-mail:', error);
        throw error;
    }
};
