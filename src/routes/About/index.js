export default {
  path: 'about',
  async getComponents(location, cb) {
    const c = await import('./components/about');
    return c.default;
  },
};
