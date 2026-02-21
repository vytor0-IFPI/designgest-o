const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const cloudSync = {
    isEnabled: !!SUPABASE_URL && !!SUPABASE_KEY,

    async fetch(table: string) {
        if (!this.isEnabled) return null;
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY!,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                },
            });
            if (!response.ok) throw new Error(`Erro ao buscar ${table}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro no Sync (Fetch ${table}):`, error);
            return null;
        }
    },

    async upsert(table: string, data: any) {
        if (!this.isEnabled) return;
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY!,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`Erro ao salvar em ${table}`);
        } catch (error) {
            console.error(`Erro no Sync (Upsert ${table}):`, error);
        }
    },

    async delete(table: string, id: string) {
        if (!this.isEnabled) return;
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY!,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                },
            });
            if (!response.ok) throw new Error(`Erro ao excluir de ${table}`);
        } catch (error) {
            console.error(`Erro no Sync (Delete ${table}):`, error);
        }
    }
};
