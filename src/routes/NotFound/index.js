export default {
  path: '*',
  async getComponents(location, cb) {
    const c = await import('../../components/NotFound');
    return c.default;
  },
};
