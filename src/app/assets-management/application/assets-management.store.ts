import { computed, Injectable, Signal, signal } from '@angular/core';
import { Sites } from '../domain/model/sites.entity';
import { AssetsManagementApi } from '../infrastructure/assets-management-api';

@Injectable({ providedIn: 'root'})
export class AssetsManagementStore {
  private readonly sitesSignal = signal<Sites[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly sites = this.sitesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private assetsManagementApi: AssetsManagementApi) {
  }

  loadSites(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assetsManagementApi.getSites().subscribe({
      next: sites => {
        this.sitesSignal.set(sites);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: error => {
        this.errorSignal.set(this.formatError(error, 'Failed to load sites'));
        this.loadingSignal.set(false);
      }
    });
  }

  getSitesById(id: string): Signal<Sites | undefined> {
    return computed(() =>
      this.sites().find(
        site => String(site.id) === id
      )
    );
  }

  addSite(site: Sites): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assetsManagementApi.createSite(site).subscribe({
      next: createdSite => {
        this.sitesSignal.update(sites => [...sites, createdSite]);
        this.loadingSignal.set(false);
      },
      error: error => {
        this.errorSignal.set(this.formatError(error, 'Failed to create site'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteSite(id: string, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assetsManagementApi.deleteSite(id).subscribe({
      next: () => {
        this.sitesSignal.update(sites =>
          sites.filter(s => String(s.id) !== String(id))
        );
        this.loadingSignal.set(false);
        onSuccess?.();
      },
      error: error => {
        this.errorSignal.set(this.formatError(error, 'Failed to delete site'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
