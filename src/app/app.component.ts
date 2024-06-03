import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastrModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
