import { Component, OnInit } from '@angular/core';
import { Media } from 'src/app/models/media';
import { Title, Meta } from '@angular/platform-browser';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  data: {
    subtitle: string,
    class: string,
    links: [{
      url: string,
      icon: string,
      name: string,
    }]
    details: [ {
      media: Media,
      title: string,
      text: string
    } ]
    header: { url: string }
  };

  constructor(
    private titleService: Title,
    private meta: Meta,
    private pageService: PageService
  ) {
    this.pageService.getPage('about-me')
      .then(post => {
        this.data = post;
        console.log(post);

        if (post !== undefined) { this.updateMetadata(); }
      });
  }

  ngOnInit() {

  }

  updateMetadata() {
    this.titleService.setTitle('About Luuk Siewers');
    this.meta.updateTag({ name: 'title', content: 'About Luuk Siewers' });
    this.meta.updateTag({ property: 'og:title', content: 'About Luuk Siewers'});
    this.meta.updateTag({ name: 'twitter:title', content: 'About Luuk Siewers'});

    this.meta.updateTag({ name: 'description', content: this.data.subtitle });
    this.meta.updateTag({ property: 'og:description', content: this.data.subtitle });
    this.meta.updateTag({ property: 'twitter:description', content: this.data.subtitle });

    this.meta.updateTag({ property: 'og:url', content: 'https://luuksiewers.nl/about-me' });
    this.meta.updateTag({ property: 'twitter:url', content: 'https://luuksiewers.nl/about-me' });

    this.meta.updateTag({ property: 'og:image', content: this.data.header.url });
    this.meta.updateTag({ property: 'twitter:image', content: this.data.header.url });
  }

}
