export default {
  path: 'about',
  getComponents(location, cb) {
    import(/* webpackPrefetch: true */ './components/About').then(compoent => cb(null, compoent.default));
  },
};
