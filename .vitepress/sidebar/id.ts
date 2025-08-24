import { DefaultTheme } from 'vitepress';

export const IDSidebar: DefaultTheme.SidebarItem[] = [
    {
        text: '星链账户中心',
        items: [
            { text: '🏠 首页', link: '/id/' },
            { text: '📱 应用申请', link: '/id/application' },
            { text: '🔐 OAuth2 授权 API', link: '/id/oauth2-authorize' },
            { text: '⚙️ OAuth2 资源 API', link: '/id/oauth2-resource' }
        ]
    }
];