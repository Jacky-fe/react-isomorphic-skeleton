export function syncRoutes(sourceRoutes, store, firstRender) {
  return sourceRoutes.map(async item => {
    if (item.getComponents && firstRender) {
      const component = await item.getComponents();
      item.component = component;
      delete item.getComponents;
    }
    return item;
  })
}