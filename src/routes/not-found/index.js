export default {
  path: '*',
  async getComponents(location, cb) {
    const c = await import('../../components/not-found');
    return c.default;
  },
};
