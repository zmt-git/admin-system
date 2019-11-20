export const permissionRouter = [
  {
    path: '/system',
    component: 'Layout',
    name: 'system',
    redirect: 'noRedirect',
    meta: { title: '系统管理', icon: 'el-icon-success' },
    children: [
      {
        path: 'params',
        name: 'params',
        component: 'system/Params',
        meta: { title: '系统参数', icon: 'el-icon-goods' }
      }
    ]
  }

]
