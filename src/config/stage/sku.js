const skuRouter = {
  route: '/sku',
  name: Symbol('sku'),
  title: 'sku管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'el-icon-goods',
  filePath: 'view/sku/', // 文件路径
  order: 8,
  inNav: true,
  children: [
    {
      title: 'sku列表',
      type: 'view',
      name: 'skuList',
      route: '/sku/list',
      filePath: 'view/sku/sku-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '创建sku',
      type: 'tab',
      name: 'createSku',
      route: '/sku/create',
      filePath: 'view/sku/sku-detail',
      inNav: false,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default skuRouter
