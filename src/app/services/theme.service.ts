import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkMode = new BehaviorSubject<boolean>(false);
  readonly darkMode$ = this._darkMode.asObservable();

  constructor() {
    // Initialize dark mode based on user preference or system setting
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setDarkMode(prefersDark.matches);

    prefersDark.addEventListener('change', (mediaQuery) => {
      this.setDarkMode(mediaQuery.matches);
    });
  }

  setDarkMode(isDark: boolean) {
    this._darkMode.next(isDark);
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this._darkMode.value);
  }

  isDarkMode() {
    return this._darkMode.value;
  }
}
