import { createFsFromVolume, Volume } from 'memfs';
import { NexeOptions } from 'nexe';
import { join, resolve } from 'path';
import webpack, { Stats } from 'webpack';
import { getBundleSource } from './create-bundle';
import { NexePlugin } from './nexe-plugin';

let nexeOptions: Partial<NexeOptions> = {};

jest.mock('nexe', () => ({
  compile: jest.fn(async (options?: Partial<NexeOptions>) => {
    if (!options) {
      return;
    }
    nexeOptions = options;
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
          output: 'test-bin',
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

    expect(nexeOptions.output).toBe(resolve(__dirname, '../__fixtures__/build/test-bin'));

    const webpackOutput = memoryFS
      .readFileSync(resolve(__dirname, '../__fixtures__/build/main.js'))
      .toString();
    const bundleSource = getBundleSource(nexeOptions);
    expect(webpackOutput).toBe(bundleSource);
  });
});
