---
name: angular-expert
description: "Angular/TypeScript frontend expert. PROACTIVELY use when working with Angular, RxJS, NgRx. Triggers: angular, ngrx, rxjs, component.ts"
autoInvoke: false
priority: high
triggers:
  - "angular"
  - "ngrx"
  - "rxjs"
  - "component.ts"
  - "angular.json"
  - "ng serve"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Angular Expert Skill

Angular 17+ patterns: standalone components, signals, RxJS, NgRx, performance.

---

## 1. Component Best Practices

### Standalone + Signals (Angular 17+)

```typescript
@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">+</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  increment() { this.count.update(c => c + 1); }
}
```

**Principle:** Always standalone, always OnPush, prefer signals over decorators. Separate Smart (container) from Dumb (presentational) components.

---

## 2. Services & DI

Use `inject()` function, `@Injectable({ providedIn: 'root' })`. Use `InjectionToken` for config values.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  getUsers(): Observable<User[]> { return this.http.get<User[]>(`${this.baseUrl}/users`); }
}
```

---

## 3. RxJS Best Practices

- **Signals integration:** `toSignal()` and `toObservable()` for bridging
- **Error handling:** `catchError` with recovery value
- **Unsubscribe:** `takeUntilDestroyed(this.destroyRef)` or `async` pipe (auto-unsubscribes)

```typescript
user = toSignal(
  toObservable(this.userId).pipe(
    filter((id): id is string => id != null),
    switchMap(id => this.userService.getUser(id)),
  )
);
```

---

## 4. State Management (NgRx)

- **createFeature** with `createReducer` + `on()` handlers
- **createActionGroup** for typed action sets
- **Functional effects** with `createEffect` + `{ functional: true }`

```typescript
export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
  },
});
```

---

## 5. Forms

Use `NonNullableFormBuilder` for typed reactive forms. Template: `[formGroup]`, `formControlName`, `@if (form.controls.email.errors?.['required'])`.

---

## 6. Routing

- **Lazy loading:** `loadComponent: () => import('./users.component').then(m => m.UsersComponent)`
- **Functional guards:** `CanActivateFn` with `inject(AuthService)`
- **Functional resolvers:** `ResolveFn<User>` with `inject(UserService)`

---

## 7. Performance

- Always `ChangeDetectionStrategy.OnPush`
- `@for (item of items; track item.id)` for lists
- `@defer (on viewport)` for heavy components with `@placeholder` and `@loading`

---

## 8. HTTP Interceptors

Use functional `HttpInterceptorFn`, register with `provideHttpClient(withInterceptors([authInterceptor]))`.

---

## 9. Testing

`TestBed.configureTestingModule({ imports: [Component] })` + `ComponentFixture` + `fixture.detectChanges()`.

---

## Quick Reference

```toon
checklist[12]{pattern,best_practice}:
  Components,Standalone + OnPush + Signals
  State,Signals for local NgRx for global
  Forms,NonNullableFormBuilder typed
  RxJS,takeUntilDestroyed + async pipe
  Routes,Lazy loading + functional guards
  DI,inject() function
  Lists,@for with track
  Defer,@defer for heavy components
  HTTP,Functional interceptors
  Testing,ComponentFixture + TestBed
  Errors,catchError with recovery
  Smart/Dumb,Container vs presentational
```

---
