const bookRouter = {
  route: null,
  name: null,
  title: '图书管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/book/', // 文件路径
  order: null,
  inNav: true, // 可以显示或者隐藏左侧菜单栏，true:显示，false:隐藏
  children: [
    {
      title: '添加图书',
      type: 'view',
      name: 'BookCreate',
      route: '/book/add',
      filePath: 'view/book/book-create.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '图书列表',
      type: 'view',
      name: 'BookCreate',
      route: '/book/list',
      filePath: 'view/book/book-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default bookRouter
