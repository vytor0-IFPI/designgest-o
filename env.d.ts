/// <reference types="vite/client" />

declare module 'react' {
    export const StrictMode: any;
    export const createContext: any;
    export const useContext: any;
    export function useState<S>(initialState: S | (() => S)): [S, any];
    export function useEffect(effect: any, deps?: any[]): void;
    export function useMemo<T>(factory: () => T, deps: any[]): T;
    export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
    export function useRef<T>(initialValue: T): any;
    export type ReactNode = any;
    export type FC<P = {}> = any;
    export type ReactElement = any;
    const React: any;
    export default React;
}

declare namespace React {
    type ReactNode = any;
}

declare module 'react/jsx-runtime' {
    export const jsx: any;
    export const jsxs: any;
    export const Fragment: any;
}

declare module 'react-dom/client' {
    export function createRoot(container: any): any;
}

declare module 'uuid' {
    export function v4(): string;
}

declare module 'lucide-react' {
    export const LayoutDashboard: any;
    export const Users: any;
    export const FolderKanban: any;
    export const Sparkles: any;
    export const BarChart3: any;
    export const Settings: any;
    export const LogOut: any;
    export const Plus: any;
    export const Search: any;
    export const Mail: any;
    export const Calendar: any;
    export const DollarSign: any;
    export const Trash2: any;
    export const Edit2: any;
    export const MoreVertical: any;
    export const MessageSquare: any;
    export const Shield: any;
    export const UserPlus: any;
    export const UserX: any;
    export const Heart: any;
    export const Clock: any;
    export const CheckCircle2: any;
    export const TrendingUp: any;
    export const AlertCircle: any;
    export const Building: any;
    export const Phone: any;
    export const Palette: any;
    export const Eye: any;
    export const EyeOff: any;
    export const LogIn: any;
    export const ArrowLeft: any;
    export const ChevronDown: any;
    export const X: any;
    export const Menu: any;
    export const ClipboardList: any;
    export const UserCircle: any;
    export const Check: any;
}

declare module '@react-oauth/google' {
    export const GoogleOAuthProvider: any;
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
