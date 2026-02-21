/// <reference types="vite/client" />

declare module 'react' {
    export = React;
    export as namespace React;
}

declare namespace React {
    type ReactNode = any;
    type FC<P = {}> = (props: P) => any;
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);
    function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
    function useContext<T>(context: any): T;
    function createContext<T>(defaultValue: T): any;
    function useRef<T>(initialValue: T | null): any;
    interface ReactElement { type: any; props: any; key: any; }
}

declare module 'react/jsx-runtime' {
    export const jsx: any;
    export const jsxs: any;
    export const Fragment: any;
}

declare module 'uuid' {
    export function v4(): string;
}

declare module 'lucide-react' {
    import { FC } from 'react';
    const icons: Record<string, FC<any>>;
    export = icons;
    export const LayoutDashboard: FC<any>;
    export const Users: FC<any>;
    export const FolderKanban: FC<any>;
    export const Sparkles: FC<any>;
    export const BarChart3: FC<any>;
    export const Settings: FC<any>;
    export const LogOut: FC<any>;
    export const Plus: FC<any>;
    export const Search: FC<any>;
    export const Mail: FC<any>;
    export const Calendar: FC<any>;
    export const DollarSign: FC<any>;
    export const Trash2: FC<any>;
    export const Edit2: FC<any>;
    export const MoreVertical: FC<any>;
    export const MessageSquare: FC<any>;
    export const Shield: FC<any>;
    export const UserPlus: FC<any>;
    export const UserX: FC<any>;
    export const Heart: FC<any>;
    export const Clock: FC<any>;
    export const CheckCircle2: FC<any>;
    export const TrendingUp: FC<any>;
    export const AlertCircle: FC<any>;
    export const Building: FC<any>;
    export const Phone: FC<any>;
}

declare module '@react-oauth/google' {
    export const GoogleOAuthProvider: React.FC<any>;
    export function useGoogleLogin(config: any): any;
}

declare module 'gapi-script' {
    export const gapi: any;
}

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
