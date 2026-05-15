import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  /**
   * @description Current theme signal. 'light' by default.
   */
  readonly isDark = signal<boolean>(false);

  /**
   * @description Toggles between light and dark theme.
   * Persists the preference in localStorage.
   */
  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.setAttribute(
      'data-theme',
      next ? 'dark' : 'light'
    );
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  /**
   * @description Loads the saved theme preference on Frigora's startup.
   */
  init(): void {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    this.isDark.set(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}
