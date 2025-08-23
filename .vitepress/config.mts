import { defineConfig } from 'vitepress';
import { VortexSidebar } from './sidebar/vortex';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    markdown: {
        config(md) {
            md.use(groupIconMdPlugin)
        },
    },
    lastUpdated: true,
    srcDir: 'pages',
    title: '挽星tEam',
    description: '挽星tEam 文档中心',
    sitemap: {
        hostname: 'https://docs.f4team.cn',
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        search: {
            provider: 'local',
            options: {
                locales: {
                    zh: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭'
                                }
                            }
                        }
                    }
                }
            }
        },
        footer: {
            copyright: 'Copyright © 2023-当前 <a href="https://www.f4team.cn">挽星tEam · F4Team</a>'
        },
        nav: [
            {
                text: '首页',
                link: '/'
            },
            {
                text: 'Vortex',
                link: '/vortex/'
            },
            {
                text: '官网',
                link: 'https://www.f4team.cn'
            }
        ],
        sidebar: {
            '/vortex': VortexSidebar
        },
        outline: {
            label: '本页内容'
        },
        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/f4team-cn'
            }
        ]
    },
    vite: {
        server: {
            host: '0.0.0.0',
            port: 8089
        },
        plugins: [
            groupIconVitePlugin()
        ]
    }
});
