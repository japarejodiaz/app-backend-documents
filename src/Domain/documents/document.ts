export class Document {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly mimetype: string,
    public readonly size: number,
    public readonly storagePath: string,
    public readonly createdAt: Date,
    public readonly userId?: string,
    public readonly analysis?: string,
    public readonly text?: string,
  ) {}

  isPdf(): boolean {
    return this.mimetype === 'application/pdf';
  }

  isDocx(): boolean {
    return this.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  isText(): boolean {
    return this.mimetype === 'text/plain';
  }
}