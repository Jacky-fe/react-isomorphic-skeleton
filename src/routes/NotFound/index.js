export default {
  path: '*',
  getComponents(location, cb) {
    import(/* webpackPrefetch: true */ '../../components/NotFound').then(compoent => cb(null, compoent.default));
  },
};
