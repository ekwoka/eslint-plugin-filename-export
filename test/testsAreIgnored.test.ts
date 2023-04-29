console.log('stuff');

export const test = () => console.log('tests should be ignored');

describe('test', () => it('is fine', () => expect(true).toBeTruthy()));
