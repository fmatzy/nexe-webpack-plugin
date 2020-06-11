import { createFsFromVolume, Volume } from 'memfs';
import { NexeOptions } from 'nexe';
import { join, resolve } from 'path';
import webpack, { Stats } from 'webpack';
import { getBundleSource } from './create-bundle';
import { NexePlugin } from './nexe-plugin';

let bundleSource = '';

jest.mock('nexe', () => ({
  compile: jest.fn(async (options?: Partial<NexeOptions>) => {
    if (!options) {
      return;
    }
    bundleSource = getBundleSource(options);
  }),
}));

describe('NexePlugin', () => {
  it('works correctly', async () => {
    const compiler = webpack({
      mode: 'development',
      entry: resolve(__dirname, '../__fixtures__/entry.js'),
      output: {
        filename: 'main.js',
        path: resolve(__dirname, '../__fixtures__/build'),
      },
      plugins: [
        new NexePlugin({
          input: 'main.js',
        }),
      ],
    });

    const memoryFS = createFsFromVolume(new Volume());
    compiler.outputFileSystem = Object.assign(memoryFS, {
      join,
    });

    const stats = await new Promise<Stats>((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }
        return resolve(stats);
      });
    });

    const { compilation } = stats;
    expect(compilation.errors.length).toBe(0);

    const webpackOutput = memoryFS
      .readFileSync(resolve(__dirname, '../__fixtures__/build/main.js'))
      .toString();
    expect(webpackOutput).toBe(bundleSource);
  });
});
