// components
import main from '@/mobile/views/main';

// templates
import MAIN from '@/mobile/templates/main';

const Router = [
    {
        path: '/',
        component: main,
        template: MAIN,
        auth: false
    }
];

export default Router;
