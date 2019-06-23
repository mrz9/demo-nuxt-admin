import path from 'path';
export default function (moduleOptions) {

	const PLUGIN_PATH = path.resolve(__dirname,'plugins');

	//添加插件
	this.addPlugin(path.resolve(PLUGIN_PATH, 'store.js'))
	this.addPlugin(path.resolve(PLUGIN_PATH, 'bridge.js'))
	this.addPlugin(path.resolve(PLUGIN_PATH, 'ui.js'))
	// this.addPlugin(path.resolve(PLUGIN_PATH, 'axios.js'))
	this.addPlugin(path.resolve(PLUGIN_PATH, 'utils.js'))
}
