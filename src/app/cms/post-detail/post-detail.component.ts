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
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '30rem',
    minHeight: '30rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    toolbarHiddenButtons: [
      [
        'indent',
        'outdent',
        'underline',
        'strikeThrough',
        'justifyRight',
        'subscript',
        'superscript',
        'foregroundColor',
        'backgroundColor',
        'fontName',
        'fontSize',
        'clearFormatting',
        'insertHorizontalRule'
      ]
    ],
    customClasses: [
      {
        name: 'Quote',
        class: 'quote'
      },
      {
        name: 'Highlight',
        class: 'highlight'
      },
      {
        name: 'Button',
        class: 'button'
      },
      {
        name: 'Button Outlined',
        class: 'button button--dark'
      }
    ]
  };
  mediaFiles: Array<{
    name: string,
    url: string,
    metadata?: Promise<{size: number, type: string}>
  }> = [];
  // tslint:disable-next-line: variable-name
  _activeRouterSubscriber: Subscription;

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

    return Math.floor(unit === 'MB' ? sizeInKb / 1024 : sizeInKb) + unit;
  }

  isArray(value: any) {
    return Array.isArray(value);
  }

  addField(metadata, type) {
    if (type === 'collaboration') {
      metadata.push({name: '', url: ''});
    } else if (type === 'tools' || type === 'client' || type === 'focus') {
      metadata.value.push('');
    }

    // metadata.push('');
  }

  removeField(metadata: any, index: number, e: Event) {
    const targetEl: HTMLInputElement = e.target as HTMLInputElement;
    if (!targetEl.value && index > 0) { metadata.value.pop(); }
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

  save() {
    console.log(this.data);

    this.workService.updateWorkPost(this.data).then(() => this.router.navigate(['/cms']));
  }

  delete() {
    if (confirm('Are you sure?')) {
      this.workService.removeWorkPost(this.data.id).then(() => this.router.navigate(['/cms']));
    }
  }

  setHeader(url: string, type: string) {
    this.data.header.type = type.includes('image') ? 'image' : 'video';
    this.data.header.url = url;
  }

  ngOnDestroy(): void {
    this._activeRouterSubscriber.unsubscribe();
  }
}
