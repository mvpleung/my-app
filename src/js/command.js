/**
 * 命令处理
 */
module.exports = (function() {
  /**
   * 前端指令列表
   * 指令格式: config:[command]:[enable]
   */
  let commandOptions = {
    logger: {
      //指令名称
      enable: true, //true or false 是否开启
      path: '/logger/true' //指令配置页路径
    }
  };

  /**
   * 执行指令
   * @param {Vue} vm vue实例
   * @param {String} command 可能存在的命令
   */
  function exec(vm, command) {
    if (!command) return;
    let commandArray = command.split(':');
    if (commandArray[0] !== 'config' || commandArray.length !== 3) return;
    for (let cmd in commandOptions) {
      if (commandArray[1] === cmd) {
        let execute = commandOptions[cmd];
        if (String(execute.enable) === commandArray[2]) {
          vm.$router.push(execute.path);
          break;
        }
      }
    }
  }

  return {
    exec: exec
  };
})();
