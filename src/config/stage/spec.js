const specRouter = {
  route: '/spec',
  name: Symbol('spec'),
  title: '规格管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'el-icon-paperclip',
  filePath: 'view/spec/', // 文件路径
  order: 6,
  inNav: true,
  children: [
    {
      title: '规格列表',
      type: 'view',
      name: 'specList',
      route: '/spec/list',
      filePath: 'view/spec/spec-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '创建规格',
      type: 'view',
      name: 'createSpec',
      route: '/spec/create',
      filePath: 'view/spec/spec-create',
      inNav: false,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default specRouter
