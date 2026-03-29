export class Analysis {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly result: any,
    public readonly createdAt: Date) {
  }

  isSummary(): boolean {
    return this.type === 'summary';
  }
}