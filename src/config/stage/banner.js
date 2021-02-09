const bannerRouter = {
  route: '/banner',
  name: Symbol('banner'),
  title: 'banner管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/banner/', // 文件路径
  order: 3,
  inNav: true,
  children: [
    {
      title: 'banner列表',
      type: 'view',
      name: 'BannerList',
      route: '/banner/list',
      filePath: 'view/banner/banner-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '创建banner',
      type: 'view',
      name: 'BannerCreate',
      route: '/banner/add',
      filePath: 'view/banner/banner-create.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default bannerRouter
