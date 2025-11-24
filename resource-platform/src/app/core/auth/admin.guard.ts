import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

const buildLoginTree = (stateUrl: string): UrlTree => {
  const router = inject(Router);
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: stateUrl },
  });
};

const hasAdminAccess = (): boolean => {
  const tokenStorage = inject(TokenStorageService);
  const token = tokenStorage.getToken();
  const role = tokenStorage.getRole();
  return !!token && role === 'Admin';
};

export const adminGuard: CanActivateFn = (_route, state) => {
  if (hasAdminAccess()) {
    return true;
  }

  return buildLoginTree(state.url);
};

export const adminChildGuard: CanActivateChildFn = (_route, state) => {
  if (hasAdminAccess()) {
    return true;
  }

  return buildLoginTree(state.url);
};

export const adminMatchGuard: CanMatchFn = (_route, segments) => {
  const attemptedUrl = `/${segments.map((segment) => segment.path).join('/')}` || '/';

  if (hasAdminAccess()) {
    return true;
  }

  return buildLoginTree(attemptedUrl);
};
