import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

const getToken = () => inject(TokenStorageService).getToken();
const buildLoginTree = (url: string): UrlTree => {
  const router = inject(Router);
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: url },
  });
};

export const authGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const tokenStorage = inject(TokenStorageService);

  if (tokenStorage.getToken()) {
    return true;
  }

  return buildLoginTree(state.url);
};

export const authMatchGuard: CanMatchFn = (_route, segments) => {
  const attemptedUrl = `/${segments.map((segment) => segment.path).join('/')}` || '/';

  if (getToken()) {
    return true;
  }

  return buildLoginTree(attemptedUrl);
};
