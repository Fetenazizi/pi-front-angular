import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bambinou';

  constructor(private router: Router) {}

  isBackoffice(): boolean {
    return this.router.url.startsWith('/backoffice');
  }
}