import { main } from './index';

jest.spyOn(console, 'log');

it('works fine', () => {
  main();
  expect(console.log).toBeCalledWith('Hello, world');
});
