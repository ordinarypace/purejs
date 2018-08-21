const Main = class {
    constructor(service, template, router){
        js.props(this, { ...service });

        this._template = template;
        this._router = router;

        this._fetchData();
    }

    async _fetchData(){
        const data = await this.http.request({ method: 'get', url: '...' });
        this.render({ data });
    }

    render({ data }){
        const render = [
            {
                target: js.$('#app'),
                data: data,
                component: this._template.index
            }
        ];

        this.template.compile(render).then(({ render }) => { if(render) console.log('Completed Render')});
    }
};

export default Main;
