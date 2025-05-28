export default (plugin: any) => {
  // Get the lifecycle hooks
  const userLifecycles = require('./content-types/user/lifecycles').default;

  // Register the lifecycle hooks with the users-permissions plugin
  plugin.contentTypes.user.lifecycles = userLifecycles;

  return plugin;
}; 