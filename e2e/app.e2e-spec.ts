import { RinkuPage } from './app.po';

describe('rinku App', function() {
  let page: RinkuPage;

  beforeEach(() => {
    page = new RinkuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
