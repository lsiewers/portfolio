import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private meta: Meta,
    private titleService: Title
  ) {
    this.updateMetadata();
  }

  updateMetadata() {
    this.titleService.setTitle('Luuk Siewers, Interaction Designer');
    this.meta.updateTag({ name: 'title', content: 'Luuk Siewers, Interaction Designer' });
    this.meta.updateTag({ property: 'og:title', content: 'Luuk Siewers, Interaction Designer'});
    this.meta.updateTag({ name: 'twitter:title', content: 'Luuk Siewers, Interaction Designer'});

    this.meta.updateTag({ name: 'description', content: 'Mostly interested in creating and improving applied experiences using design methods and technology.' });
    this.meta.updateTag({ property: 'og:description', content: 'Mostly interested in creating and improving applied experiences using design methods and technology.' });
    this.meta.updateTag({ property: 'twitter:description', content: 'Mostly interested in creating and improving applied experiences using design methods and technology.' });

    this.meta.updateTag({ property: 'og:url', content: 'https://luuksiewers.nl/' });
    this.meta.updateTag({ property: 'twitter:url', content: 'https://luuksiewers.nl/' });

    this.meta.updateTag({ property: 'og:image', content: '//luuksiewers.nl/assets/images/meta-image.png' });
    this.meta.updateTag({ property: 'twitter:image', content: '//luuksiewers.nl/assets/images/meta-image.png' });
  }
}
