# purejs
Not SPA, Simple Framework base ES2015+, Laravel (bundling to laravel mix)

# Use

##### install dependencies & dev dependencies
```bash
$npm install
```

##### Router
services/router/index.js

```bash
{
    path: '/',
    component: component,
    template: template,
    children: [
        {
            path: '/:id',
            component: component,
            template: template
        }
    ]
}
```

##### Module
```bash
views/...js

const ModuleName = class {
  constructor(service, template){
        // inject service, template
        Helper.object.prop(this, { ...service });

        this._template = template;
        this._fetchData();
    }

    async _fetchData(){
        const data = await this.http.request({ method: 'get', url: '...' });
        this.render({ data });
    }

    render({ data }){
        const render = [
            {
                target: Helper.$.get('#app'),
                data: data,
                component: this._template.index
            }
        ];

        this.template.compile(render).then(({ render }) => { if(render) console.log('Completed Render')});
    }
}
```

##### Dynamic Loaded
```bash
services/router/index.js

Loader = (isMobile = Helper.isMobile()) => isMobile ? import('/mobile/sheme') : import('/pc/scheme'); 
```

##### Templates
```bash
templates/...js

JSX Style
export default {
  index({ data, index }){
    return (`<div id="app>${data.id}</div>"`);
  }
};

Create Elements
export default {
  index({ data, index }){
    return Helper.el('div', 'class', 'app', 'innerHTML', 'app')'
  }
};
```

