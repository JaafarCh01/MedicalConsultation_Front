import { Component } from '@angular/core';
import { DocardComponent } from '../../components/docard/docard.component';
import { SearchComponent } from '../../components/search/search.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [ DocardComponent , SearchComponent , CommonModule],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent {
  cards = [
    { image: 'https://as2.ftcdn.net/v2/jpg/03/20/52/31/1000_F_320523164_tx7Rdd7I2XDTvvKfz2oRuRpKOPE5z0ni.jpg', name: 'Jaafar Cherkaoui', price: '50$ per consulation' },
    { image: 'https://as2.ftcdn.net/v2/jpg/02/60/04/09/1000_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg', name: 'Achraf Issiki', price: '40$ per consulation' },
    { image: 'https://as1.ftcdn.net/v2/jpg/02/40/58/88/1000_F_240588865_e81rl476gizNT8M7ogrU5YR3i0wln0qH.jpg', name: 'Ali Aitbelmous', price: '40$ per consulation' },
    { image: 'https://as2.ftcdn.net/v2/jpg/03/36/01/25/1000_F_336012505_jcYVs9b7EEVKSfEvWTtOR0inmCugWnO6.jpg', name: 'Chick watermelon', price: '40$ per consulation' },
    { image: 'https://as2.ftcdn.net/v2/jpg/01/74/68/73/1000_F_174687350_UWSczPocPvB0r9NAMkUHDpn0eKHQaB7v.jpg', name: 'Mekansi fassi', price: '50$ per consulation' },
    { image: 'https://as2.ftcdn.net/v2/jpg/04/93/42/45/1000_F_493424533_RejfRmPCQ5qLv5z8FbDTLZvaF75zaMzP.jpg', name: 'tabla antinigga', price: '220$ per consulation' },

  ];
}
