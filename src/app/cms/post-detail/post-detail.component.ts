import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, OnDestroy } from '@angular/core';
import { Item } from 'src/app/models/item';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { WorkService } from 'src/app/services/work.service';
import { isArray } from 'util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, AfterContentChecked, OnDestroy {
  data: Item;

  mediaFiles: Array<{
    name: string,
    url: string,
    metadata?: Promise<{size: number, type: string}>
  }> = [];
  // tslint:disable-next-line: variable-name
  _activeRouterSubscriber: Subscription;
  postUrl: string;

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private workService: WorkService,
    private changeDetector: ChangeDetectorRef
  ) {
    this._activeRouterSubscriber =
      this.activeRouter.params.subscribe(data =>
        this.workService.getWorkPost(data.id)
          .then((post: Item) => {
            this.postUrl = data.id;
            this.data = post;
            this.updateFiles();
          })
      );
  }

  ngAfterContentChecked() { this.changeDetector.detectChanges(); }

  ngOnInit() {

  }

  calcFileSize(num: number): string {
    const sizeInKb = num / 1024;
    const unit = sizeInKb > 1024 ? 'MB' : 'kb';

    return (unit === 'MB' ? (sizeInKb / 1024).toFixed(1) : Math.floor(sizeInKb)) + unit;
  }

  isArray(value: any) {
    return Array.isArray(value);
  }

  addField(metadata, type) {
    if (type === 'collaboration') {
      metadata.push({name: '', url: ''});
    } else if (type === 'links') {
      metadata.push({name: '', icon: '', url: ''});
    } else if (type === 'tools' || type === 'client' || type === 'focus') {
      metadata.value.push('');
    }

    // metadata.push('');
  }

  removeField(metadata: any, index: number, e: Event) {
    console.log(metadata.value[index].length);

    if (metadata.value[index].length <= 0) {
      metadata.value.splice(index, 1);
    }
  }

  uploadFile(e: Event) {
    const inputFile = (e.target as HTMLInputElement).files[0];
    const ref = this.workService.getMediaFolder(this.data.id);
    const imageRef = ref.child(inputFile.name);

    imageRef.put(inputFile).then(() => this.updateFiles());
  }

  deleteFile(img: string) {
    const ref = this.workService.getMediaFolder(this.data.id);
    const imageRef = ref.child(img);
    imageRef.delete().then(() => this.updateFiles());
  }

  updateFiles() {
    this.mediaFiles = [];

    this.workService.getMediaFolder(this.data.id).listAll().then(files => {
      files.items.forEach(file => file.getDownloadURL()
        .then(downloadUrl => {
          this.mediaFiles.push({
            name: file.name,
            url: downloadUrl,
            metadata: file.getMetadata().then(data => {
              return {size: data.size, type: data.contentType};
            })
          });
        })
      );
    });
  }

  quickSave() {
    this.workService.updateWorkPost(this.data)
      .then(() => alert('saved!'))
      .catch(err => alert('Whoops: ' + err));
  }

  save() {
    this.workService.updateWorkPost(this.data).then(() => this.router.navigate(['/cms']));
  }

  delete() {
    if (confirm('Are you sure?')) {
      this.workService.removeWorkPost(this.data.id).then(() => this.router.navigate(['/cms']));
    }
  }

  addParagraph() {
    this.data.details.push({
      media: {
        url: '',
        ref: 'This is an image caption',
        type: 'image'
      },
      title: 'This is a title',
      text: 'This is some text',
      links: [],
      class: 'image--right'
    });
  }

  removeParagraph(i: number) {
    this.data.details.splice(i, 1);
  }

  addLink(i: number) {
    this.data.details[i].links.push({name: 'a link', icon: '', url: ''});
  }
  removeLink(i: number, j: number) {
    this.data.details[i].links.splice(j, 1);
  }

  setHeader(url: string, type: string) {
    this.data.header.type = type.includes('image') ? 'image' : 'video';
    this.data.header.url = url;
  }

  toClipboard(e: Event) {
    const input = document.createElement('textarea');
    input.innerHTML = (e.target as HTMLElement).outerHTML;
    document.body.appendChild(input);
    input.select();
    const result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }

  ngOnDestroy(): void {
    this._activeRouterSubscriber.unsubscribe();
  }
}
