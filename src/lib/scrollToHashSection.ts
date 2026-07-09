/** Scroll to the top of the page. */
export function scrollToPageTop(): void {
  window.scrollTo(0, 0);
}

/** Scroll to a hash target, retrying until the element exists (lazy sections). */
export function scrollToHashSection(hash?: string, delayMs = 0): void {
  const id = (hash || window.location.hash).replace(/^#/, '');
  if (!id) return;

  const scroll = () => {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  };

  const attempt = (triesLeft: number) => {
    if (scroll() || triesLeft <= 0) return;
    window.setTimeout(() => attempt(triesLeft - 1), 100);
  };

  window.setTimeout(() => attempt(15), delayMs);
}
