export default {
  PAGE_ROUTE: [
    {
      "label": "menu.common",
      "default": true,
      "child": [
        {
          "icon": "el-icon-star-on",
          "label": "menu.home",
          "name": "index",
          "type": "link",
          "path": "/"
        },
        {
          "icon": "el-icon-star-on",
          "label": "menu.member-manage",
          "name": "member",
          "type": "link",
          "path": "/member"
        },
        {
          "icon": "el-icon-star-on",
          "label": "menu.content-manage",
          "name": "conent",
          "child": [
            {
              "icon": "el-icon-star-on",
              "label": "menu.content-list",
              "name": "conent",
              "type": "link",
              "path": "/conent"
            }
          ]
        },
      ]
    },
    {
      "label": "menu.order-manage",
      "child": [
        {
          "icon": "el-icon-star-on",
          "label": "menu.order-list",
          "name": "order",
          "type": "link",
          "path": "/order"
        },
        {
          "icon": "el-icon-star-on",
          "label": "menu.order-add",
          "name": "order-create",
          "type": "link",
          "path": "/order/create"
        }
      ]
    },
    {
    "label": "menu.component",
    "child": [
      {
        "icon": "el-icon-star-on",
        "label": "menu.component-upload",
        "name": "component-upload",
        "type": "link",
        "path": "/component/upload"
      },
    ]
  },
    {
    "label": "menu.base-manage",
    "child": [
      {
        "icon": "el-icon-star-on",
        "label": "menu.base-setting",
        "name": "setting",
        "type": "link",
        "path": "/setting"
      },
    ]
  }]
};
