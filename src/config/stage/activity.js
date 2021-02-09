const activityRouter = {
  route: '/activity',
  name: Symbol('activity'),
  title: '活动管理',
  type: 'folder', // 类型: folder:表明是一个主菜单，下面还有子菜单；tab, view:表示是一个舞台
  icon: 'el-icon-notebook-1',
  filePath: 'view/activity/', // 文件路径
  order: 10,
  inNav: true,
  children: [
    {
      title: '活动列表',
      type: 'view',
      name: 'activityList',
      route: '/activity/list',
      filePath: 'view/activity/activity-list',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}
export default activityRouter
