const gridRouter = {
  route: '/grid',
  name: Symbol('grid'),
  title: '六宫格管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'el-icon-s-grid',
  filePath: 'view/grid/', // 文件路径
  order: 5,
  inNav: true,
  children: [
    {
      title: '六宫格列表',
      type: 'view',
      name: 'gridList',
      route: '/grid/list',
      filePath: 'view/grid/grid-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default gridRouter
