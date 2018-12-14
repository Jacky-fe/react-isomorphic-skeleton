declare var IS_BROWSER: boolean;
declare var global : {
  config: any,
  server: any,
};
declare var require: function;
declare type redialHooks = {
  dispatch: any,
  params: any,
};