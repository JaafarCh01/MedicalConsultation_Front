import { Component, Input } from '@angular/core';
import { MedicalCategories } from '../../models/medical-categories';
import { MedicalCategoriesDisplay } from '../../models/medical-categories-display';

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
  @Input() specialty: MedicalCategories = MedicalCategories.INTERNAL_MEDICINE;

  get specialtyDisplay(): string {
    return MedicalCategoriesDisplay[this.specialty];
  }
}
