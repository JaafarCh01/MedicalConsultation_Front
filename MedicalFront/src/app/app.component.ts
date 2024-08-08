import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { HeroComponent } from "./components/hero/hero.component";
import { CardComponent } from "./components/card/card.component";
import { FooterComponent } from "./components/footer/footer.component";
import { TestimonialsComponent } from "./components/testimonials/testimonials.component";
import { initFlowbite } from "flowbite";
import { isPlatformBrowser } from "@angular/common";
import { LayoutComponent } from "./components/layout/layout.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    HeroComponent,
    CardComponent,
    FooterComponent,
    TestimonialsComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "MedicalFront";

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import("flowbite").then(({ initFlowbite }) => {
        initFlowbite();
      });
    }
  }
}
