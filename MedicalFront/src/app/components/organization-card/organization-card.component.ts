import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-organization-card',
  standalone: true,
  imports: [],
  templateUrl: './organization-card.component.html',
  styleUrl: './organization-card.component.css'
})
export class OrganizationCardComponent {
  @Input() name!: string;
  @Input() type!: string;
  @Input() city!: string;
  @Input() address!: string;

}



