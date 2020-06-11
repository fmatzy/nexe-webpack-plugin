import { compile as nexeCompile } from 'nexe';
import { NexePluginOptions } from 'options';
import { resolve } from 'path';
import { Compiler, Plugin } from 'webpack';
import { setBundleSource } from './create-bundle';

interface AssetSource {
  source(): Buffer | string;
}

export class NexePlugin implements Plugin {
  private options: NexePluginOptions[];

  constructor(options: NexePluginOptions | NexePluginOptions[] = []) {
    this.options = Array.isArray(options) ? options : [options];
  }

  apply(compiler: Compiler): void {
    compiler.hooks.emit.tapPromise('NexePlugin', async (compilation) => {
      for (const options of this.options) {
        const { input = 'main.js' } = options;
        const assetSource: AssetSource = compilation.assets[input];
        if (!assetSource) {
          compilation.errors.push(new Error(`input source "${input}" not found`));
          return;
        }

        const inputSource = assetSource.source().toString();

        const bundledOptions = setBundleSource(options, inputSource);
        await nexeCompile({
          ...bundledOptions,
          input: '-',
          bundle: resolve(__dirname, './create-bundle'),
          silent: true,
        });
      }
    });
  }
}
