export default async function(components) {
  const preloadCompoents = await Promise.all(components.map(item => item.preload && item.preload()));
  preloadCompoents.forEach((item, index) => {
    if (item) {
      preloadCompoents[index] = item.default;
    } else {
      preloadCompoents[index] = components[index];
    }
  });
  return preloadCompoents;
}