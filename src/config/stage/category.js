const categoryRouter = {
  route: '/category',
  name: Symbol('category'),
  title: '分类管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'el-icon-guide',
  filePath: 'view/category/', // 文件路径
  order: 4,
  inNav: true,
  children: [
    {
      title: '分类列表',
      type: 'view',
      name: 'categoryList',
      route: '/category/list',
      filePath: 'view/category/category-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default categoryRouter
