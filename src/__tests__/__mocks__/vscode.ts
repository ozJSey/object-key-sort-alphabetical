export const Range = jest.fn((start, end) => ({ start, end }));
export const Position = jest.fn((line, char) => ({ line, character: char }));
export const TextEdit = {
  replace: jest.fn((range, newText) => ({ range, newText }))
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

