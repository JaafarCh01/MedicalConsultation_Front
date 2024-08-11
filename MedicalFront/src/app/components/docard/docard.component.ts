import { Component} from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-docard',
  standalone: true,
  imports: [],
  templateUrl: './docard.component.html',
  styleUrl: './docard.component.css'
})
export class DocardComponent {
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() price: string = '';

}
