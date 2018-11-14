export function syncRoutes(sourceRoutes) {
  return sourceRoutes.map(async item => {
    if (item.getComponents) {
      const component = await item.getComponents();
      item.component = component;
      delete item.getComponents;
    }
    return item;
  })
}