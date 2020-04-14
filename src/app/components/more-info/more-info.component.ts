import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss']
})
export class MoreInfoComponent implements OnInit {

  constructor(
    private meta: Meta,
    private titleService: Title
  ) {
    this.updateMetadata();
  }

  ngOnInit() {
  }

  updateMetadata() {
    this.titleService.setTitle('More about me');
    this.meta.updateTag({ name: 'title', content: 'More about me' });
    this.meta.updateTag({ property: 'og:title', content: 'More about me'});
    this.meta.updateTag({ name: 'twitter:title', content: 'More about me'});

    this.meta.updateTag({
      name: 'description',
      // tslint:disable-next-line: max-line-length
      content: 'Coming from a study focused on webdesign, I want to dive deeper into the wider definition and possibilities of interaction design. I have a big interest in how new technologies influences our behaviour, our look at technology and how interacting with technology feels.'
    });
    this.meta.updateTag({
      property: 'og:description',
      // tslint:disable-next-line: max-line-length
      content: 'Coming from a study focused on webdesign, I want to dive deeper into the wider definition and possibilities of interaction design. I have a big interest in how new technologies influences our behaviour, our look at technology and how interacting with technology feels.'
    });
    this.meta.updateTag({
      property: 'twitter:description',
      // tslint:disable-next-line: max-line-length
      content: 'Coming from a study focused on webdesign, I want to dive deeper into the wider definition and possibilities of interaction design. I have a big interest in how new technologies influences our behaviour, our look at technology and how interacting with technology feels.'
    });

    this.meta.updateTag({ property: 'og:url', content: 'https://luuksiewers.nl/about-me' });
    this.meta.updateTag({ property: 'twitter:url', content: 'https://luuksiewers.nl/about-me' });
  }

}
