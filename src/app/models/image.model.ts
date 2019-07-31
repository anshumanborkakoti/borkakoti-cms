export class Image {
  constructor(public publicId: string = '', public format: string = '',
    public tags: string[] = [], public secureUrl: string = '',
    public url: string = '') { }
}
