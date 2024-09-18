import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

// Required for every (standalone) Angular application.
// For info about standalone components (and a comparison to the old modules approach),
// see https://angular.io/guide/standalone-components
// HttpClient is used e.g. to fetch files from the local filesystem

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideRouter(routes),
        provideHttpClient()
    ]
}).catch((err) => console.error(err));
