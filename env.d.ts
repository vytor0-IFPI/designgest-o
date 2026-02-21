/// <reference types="vite/client" />

// Declarações de módulos para uso sem node_modules instalado localmente
// Estas declarações permitem ao TypeScript verificar o código sem erros.
// Quando 'npm install' for executado, os tipos reais substituirão estas declarações.

declare module 'react' {
    // Exportações mínimas para satisfazer o TypeScript
    export = React;
    export as namespace React;
}

declare namespace React {
    type ReactNode = any;
    type FC<P = {}> = (props: P) => any;
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);
    type FormEvent<T = Element> = any;
    type ChangeEvent<T = Element> = any;
    function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
    function useContext<T>(context: any): T;
    function createContext<T>(defaultValue: T): any;
    function useRef<T>(initialValue: T | null): any;
    function useMemo<T>(factory: () => T, deps: readonly any[]): T;
    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
    function useReducer<R extends any>(reducer: R, initialState: any): [any, Dispatch<any>];
    function memo<P extends object>(Component: FC<P>): FC<P>;
    interface ReactElement { type: any; props: any; key: any; }
    interface ReactPortal { type: any; props: any; key: any; }
}

declare module 'react/jsx-runtime' {
    export function jsx(type: any, props: any, key?: any): any;
    export function jsxs(type: any, props: any, key?: any): any;
    export const Fragment: any;
}

declare module 'react-dom/client' {
    export function createRoot(container: Element | DocumentFragment): {
        render(element: any): void;
        unmount(): void;
    };
}

declare module 'uuid' {
    export function v4(): string;
}

declare module 'lucide-react' {
    import { FC } from 'react';
    type IconProps = { size?: number; className?: string; strokeWidth?: number; color?: string; };
    const icons: Record<string, FC<IconProps>>;
    export = icons;
    export const Palette: FC<IconProps>;
    export const Eye: FC<IconProps>;
    export const EyeOff: FC<IconProps>;
    export const LogIn: FC<IconProps>;
    export const AlertCircle: FC<IconProps>;
    export const LayoutDashboard: FC<IconProps>;
    export const Users: FC<IconProps>;
    export const FolderOpen: FC<IconProps>;
    export const DollarSign: FC<IconProps>;
    export const MessageSquare: FC<IconProps>;
    export const Settings: FC<IconProps>;
    export const LogOut: FC<IconProps>;
    export const Plus: FC<IconProps>;
    export const Pencil: FC<IconProps>;
    export const Trash2: FC<IconProps>;
    export const X: FC<IconProps>;
    export const Check: FC<IconProps>;
    export const ChevronDown: FC<IconProps>;
    export const ChevronUp: FC<IconProps>;
    export const Search: FC<IconProps>;
    export const Filter: FC<IconProps>;
    export const Bell: FC<IconProps>;
    export const User: FC<IconProps>;
    export const Mail: FC<IconProps>;
    export const Phone: FC<IconProps>;
    export const Building: FC<IconProps>;
    export const Calendar: FC<IconProps>;
    export const Clock: FC<IconProps>;
    export const TrendingUp: FC<IconProps>;
    export const TrendingDown: FC<IconProps>;
    export const ArrowRight: FC<IconProps>;
    export const ArrowLeft: FC<IconProps>;
    export const BarChart: FC<IconProps>;
    export const PieChart: FC<IconProps>;
    export const Upload: FC<IconProps>;
    export const Download: FC<IconProps>;
    export const FileText: FC<IconProps>;
    export const Briefcase: FC<IconProps>;
    export const Star: FC<IconProps>;
    export const Heart: FC<IconProps>;
    export const Home: FC<IconProps>;
    export const Menu: FC<IconProps>;
    export const MoreVertical: FC<IconProps>;
    export const MoreHorizontal: FC<IconProps>;
    export const Shield: FC<IconProps>;
    export const Lock: FC<IconProps>;
    export const Unlock: FC<IconProps>;
    export const UserPlus: FC<IconProps>;
    export const UserMinus: FC<IconProps>;
    export const UserCheck: FC<IconProps>;
    export const UserX: FC<IconProps>;
    export const Save: FC<IconProps>;
    export const Edit: FC<IconProps>;
    export const Edit2: FC<IconProps>;
    export const Edit3: FC<IconProps>;
    export const RefreshCw: FC<IconProps>;
    export const AlertTriangle: FC<IconProps>;
    export const Info: FC<IconProps>;
    export const CheckCircle: FC<IconProps>;
    export const XCircle: FC<IconProps>;
    export const Circle: FC<IconProps>;
    export const Loader: FC<IconProps>;
    export const Loader2: FC<IconProps>;
    export const Zap: FC<IconProps>;
    export const Target: FC<IconProps>;
    export const Tag: FC<IconProps>;
    export const Link: FC<IconProps>;
    export const ExternalLink: FC<IconProps>;
    export const Copy: FC<IconProps>;
    export const Clipboard: FC<IconProps>;
    export const Hash: FC<IconProps>;
    export const Code: FC<IconProps>;
    export const Layers: FC<IconProps>;
    export const Grid: FC<IconProps>;
    export const List: FC<IconProps>;
    export const Table: FC<IconProps>;
    export const Image: FC<IconProps>;
    export const Camera: FC<IconProps>;
    export const Send: FC<IconProps>;
    export const Inbox: FC<IconProps>;
    export const Archive: FC<IconProps>;
    export const Folder: FC<IconProps>;
    export const FolderPlus: FC<IconProps>;
    export const ChevronLeft: FC<IconProps>;
    export const ChevronRight: FC<IconProps>;
    export const ChevronsLeft: FC<IconProps>;
    export const ChevronsRight: FC<IconProps>;
    export const SortAsc: FC<IconProps>;
    export const SortDesc: FC<IconProps>;
    export const Activity: FC<IconProps>;
    export const Award: FC<IconProps>;
    export const Bookmark: FC<IconProps>;
    export const Flag: FC<IconProps>;
    export const Globe: FC<IconProps>;
    export const Map: FC<IconProps>;
    export const MapPin: FC<IconProps>;
    export const Maximize: FC<IconProps>;
    export const Minimize: FC<IconProps>;
    export const Monitor: FC<IconProps>;
    export const Smartphone: FC<IconProps>;
    export const Tablet: FC<IconProps>;
    export const Printer: FC<IconProps>;
    export const Power: FC<IconProps>;
    export const ToggleLeft: FC<IconProps>;
    export const ToggleRight: FC<IconProps>;
    export const Sliders: FC<IconProps>;
    export const Columns: FC<IconProps>;
    export const Layout: FC<IconProps>;
    export const Sidebar: FC<IconProps>;
    export const EyeOff: FC<IconProps>;
    export const AlignLeft: FC<IconProps>;
    export const AlignCenter: FC<IconProps>;
    export const AlignRight: FC<IconProps>;
    export const Bold: FC<IconProps>;
    export const Italic: FC<IconProps>;
    export const Underline: FC<IconProps>;
    export const Type: FC<IconProps>;
}
// ... (previous content kept)

declare module 'path' {
    const path: any;
    export default path;
}

declare module 'url' {
    export function fileURLToPath(url: string | URL): string;
}

declare module 'vite' {
    export function defineConfig(config: any): any;
    export function loadEnv(mode: string, envDir: string, prefixes?: string | string[]): Record<string, string>;
}

declare module '@vitejs/plugin-react' {
    const react: any;
    export default react;
}

declare module '@tailwindcss/vite' {
    const tailwindcss: any;
    export default tailwindcss;
}

declare module 'vite-plugin-singlefile' {
    export function viteSingleFile(config?: any): any;
}

declare module '@react-oauth/google' {
    export const GoogleOAuthProvider: any;
    export function useGoogleLogin(config: any): any;
}

declare module 'gapi-script' {
    export const gapi: any;
}
