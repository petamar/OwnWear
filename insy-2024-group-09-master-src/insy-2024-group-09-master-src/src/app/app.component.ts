import {Component, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenubarComponent } from './menubar/menubar.component';



@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',

})
export class AppComponent {
    title = 'interactive-systems-ss24';

    selectedFilters: any = {};

    onFiltersChanged(filters: any): void {
      this.selectedFilters = filters;
    }
}


