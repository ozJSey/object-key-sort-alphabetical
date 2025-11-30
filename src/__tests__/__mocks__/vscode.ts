export const Range = jest.fn();
export const Position = jest.fn();
export const TextEdit = {
  replace: jest.fn()
};
export const workspace = {
  getConfiguration: jest.fn(() => ({
    get: jest.fn(() => true)
  })),
  onDidSaveTextDocument: jest.fn()
};
export const window = {
  activeTextEditor: null
};

