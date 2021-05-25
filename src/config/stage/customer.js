const customerRouter = {
  route: '/customer',
  name: Symbol('customer'),
  title: '用户端数据管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'iconfont icon-huiyuanguanli',
  filePath: 'view/customer/', // 文件路径
  order: 1,
  inNav: true,
  children: [
    {
      title: '订单列表',
      type: 'view',
      name: 'orderList',
      route: '/order/list',
      filePath: 'view/customer/order-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '用户列表',
      type: 'view',
      name: 'userList',
      route: '/user/list',
      filePath: 'view/customer/user-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default customerRouter
