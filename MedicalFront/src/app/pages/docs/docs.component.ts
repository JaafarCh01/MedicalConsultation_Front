import { Component } from '@angular/core';
import { DocardComponent } from '../../components/docard/docard.component';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [ DocardComponent , SearchComponent ],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent {

}
