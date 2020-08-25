import { init } from 'snabbdom/build/package/init';
import { propsModule } from 'snabbdom/build/package/modules/props';

const reconcile = init([propsModule]);

const simsimReactDom = {
	render: (virtualDom, realDom) => {
		console.log(virtualDom);
		reconcile(realDom, virtualDom);
	},
};

export default simsimReactDom;
