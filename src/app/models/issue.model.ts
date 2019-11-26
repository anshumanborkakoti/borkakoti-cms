import { Tag } from './tag.model';
import { Thumbnail, createThumbnail } from './thumbnail.model';
import { cloneCmsClass } from '../common/util/utils';

export class Issue implements Tag<Issue> {
  equals(that: Issue): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;
  }
  clone(): Issue {
    return new Issue(
      this.name,
      this.id,
      this.label,
      cloneCmsClass(this.thumbnail),
      this.published,
      this.archived,
      this.pdfUrl,
      this.latest
    );
  }
  constructor(
    public name = '',
    public id = null,
    public label = '',
    public thumbnail: Thumbnail = null,
    public published: boolean = false,
    public archived: boolean = false,
    public pdfUrl: string = null,
    public latest: boolean = false
  ) {

  }
}
export function createIssue({ name, _id, id, label, thumbnail, published, archived, pdfUrl, latest }): Issue {
  return new Issue(
    name,
    _id || id || null,
    label,
    createThumbnail(thumbnail),
    published,
    archived,
    pdfUrl,
    latest
  );
}
export function createIssues(issueArray: { name, _id, id, label, thumbnail, published, archived, pdfUrl, latest }[]): Issue[] {
  return issueArray.map(aIssueOb => {
    return createIssue(aIssueOb);
  });
}
