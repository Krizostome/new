import { UrlPipe } from './url.pipe';

describe('UrlPipe', () => {
  it('create an instance', () => {
    const pipe = new UrlPipe(null as any);
    expect(pipe).toBeTruthy();
  });
});
