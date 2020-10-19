
const Compiler = require("./compiler");

//webpack相关配置
const options = require("../simplePack.config");

new Compiler(options).run();

