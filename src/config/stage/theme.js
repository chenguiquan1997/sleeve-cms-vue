const themeRouter = {
  route: '/theme',
  name: Symbol('theme'),
  title: '主题管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'el-icon-s-marketing',
  filePath: 'view/theme/', // 文件路径
  order: 9,
  inNav: true,
  children: [
    {
      title: '主题列表',
      type: 'view',
      name: 'themeList',
      route: '/theme/list',
      filePath: 'view/theme/theme-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default themeRouter
