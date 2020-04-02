import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Item } from 'src/app/models/item';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, AfterContentChecked {
  data: Item;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '30rem',
    minHeight: '25rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Questrial',
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
      }
    ]
  };
  images: Array<{name: string, url: string}> = [];

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private workService: WorkService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.activeRouter.params.subscribe(data => this.workService.getWorkPost(decodeURI(data.id)).then((post: Item) => {
      this.data = post;
      this.updateImages();
    }));
  }

  ngAfterContentChecked() { this.changeDetector.detectChanges(); }

  ngOnInit() {

  }

  isArray(value: any) {
    return !(typeof value === 'string');
  }

  addField(metadataType: string) {
    (this.data.metadata
    .find(subdata => subdata.type === metadataType)
    .values as string[]).push('');
  }

  removeField(metadataType: string, index: number, e: Event) {
    const targetEl: HTMLInputElement = e.target as HTMLInputElement;
    const metadataValues = this.data.metadata
      .find(subdata => subdata.type === metadataType)
      .values as string[];


    if (!targetEl.value && index > 0) { metadataValues.pop(); }
  }

  uploadImage(e: Event) {
    const inputFile = (e.target as HTMLInputElement).files[0];
    const ref = this.workService.getMediaFolder(this.data.id);
    const imageRef = ref.child(inputFile.name);

    imageRef.put(inputFile).then(() => this.updateImages());
  }

  deleteImage(img: string) {
    const ref = this.workService.getMediaFolder(this.data.id);
    const imageRef = ref.child(img);
    imageRef.delete().then(() => this.updateImages());
  }

  updateImages() {
    this.images = [];

    this.workService.getMediaFolder(this.data.id).listAll().then(images => {
      images.items.forEach(item => item.getDownloadURL().then(downloadUrl => {
        this.images.push({
          name: item.name,
          url: downloadUrl
        });
      }));
    });
  }

  save() {
    this.workService.updateWorkPost(this.data).then(() => this.router.navigate(['/cms']));
  }

  delete() {
    if (confirm('Are you sure?')) {
      this.workService.removeWorkPost(this.data.id).then(() => this.router.navigate(['/cms']));
    }
  }
}
