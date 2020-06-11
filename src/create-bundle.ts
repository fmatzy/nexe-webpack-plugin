import { NexeOptions } from 'nexe';

const BUNDLE_SOURCE = Symbol();

interface BundleOptions {
  [BUNDLE_SOURCE]: string;
}

export function setBundleSource(
  options: Partial<NexeOptions>,
  source: string
): Partial<NexeOptions> {
  return Object.assign({}, options, {
    [BUNDLE_SOURCE]: source,
  });
}

export function getBundleSource(options: Partial<NexeOptions>): string {
  return (options as BundleOptions)[BUNDLE_SOURCE];
}

export async function createBundle(options: Partial<NexeOptions>): Promise<string> {
  return getBundleSource(options);
}
