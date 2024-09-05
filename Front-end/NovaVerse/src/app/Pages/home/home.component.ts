import { Component } from '@angular/core';
import { SwiperOptions } from 'swiper/types';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: { clickable: true },
    navigation: true,
  };
}
