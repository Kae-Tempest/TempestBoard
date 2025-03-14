import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const token: string | null = localStorage.getItem('token');
  if (token === null) {
    return next(req.clone());
  }
  const authToken: string = `Bearer ${token}`;
  const newReq = req.clone({
    headers: req.headers.append('Authorization', authToken),
  });
  return next(newReq);
}
