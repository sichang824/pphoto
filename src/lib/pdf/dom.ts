export function disableTransform(wrapper: HTMLElement): string | undefined {
  const prevTransform = wrapper?.style.transform;
  wrapper.style.setProperty("transform", "none", "important");
  return prevTransform;
}

export function restoreTransform(wrapper: HTMLElement, prevTransform?: string) {
  if (prevTransform) wrapper.style.setProperty("transform", prevTransform);
  else wrapper.style.removeProperty("transform");
}
