const spuRouter = {
  route: '/spu',
  name: Symbol('spu'),
  title: 'spu管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'el-icon-s-goods',
  filePath: 'view/spu/', // 文件路径
  order: 7,
  inNav: true,
  children: [
    {
      title: 'spu列表',
      type: 'view',
      name: 'spuList',
      route: '/spu/list',
      filePath: 'view/spu/spu-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default spuRouter
