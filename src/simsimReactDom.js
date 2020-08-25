import snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';

const reconcile = snabbdom.init([propsModule]);

const simsimReactDom = {
	render: (virtualDom, realDom) => {
		reconcile(realDom, virtualDom);
	},
};

export default simsimReactDom;
