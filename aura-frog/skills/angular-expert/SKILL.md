---
name: angular-expert
description: "Angular/TypeScript frontend expert. PROACTIVELY use when working with Angular, RxJS, NgRx. Triggers: angular, ngrx, rxjs, component.ts"
autoInvoke: true
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

Expert-level Angular patterns for components, RxJS, state management, and performance.

---

## Auto-Detection

This skill activates when:
- Working with Angular projects
- Detected `angular.json` or `@angular/core` in package.json
- Working with `*.component.ts`, `*.service.ts` files
- Using RxJS, NgRx, or Angular Material

---

## 1. Component Best Practices

### Standalone Components (Angular 17+)

```typescript
// ✅ GOOD - Standalone component
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <a [routerLink]="['/users', user.id]">View Profile</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output() selected = new EventEmitter<User>();
}
```

### Signal-Based Components (Angular 17+)

```typescript
// ✅ GOOD - Signals for reactive state
@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()">+</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(c => c + 1);
  }
}
```

### Smart vs Dumb Components

```typescript
// ✅ GOOD - Container (Smart) component
@Component({
  selector: 'app-users-container',
  standalone: true,
  imports: [UserListComponent],
  template: `
    <app-user-list
      [users]="users()"
      [loading]="loading()"
      (userSelected)="onUserSelected($event)"
    />
  `,
})
export class UsersContainerComponent {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  loading = signal(false);

  constructor() {
    this.loadUsers();
  }

  private async loadUsers() {
    this.loading.set(true);
    this.users.set(await this.userService.getUsers());
    this.loading.set(false);
  }

  onUserSelected(user: User) {
    this.userService.selectUser(user);
  }
}

// ✅ GOOD - Presentational (Dumb) component
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading) {
      <div class="loading">Loading...</div>
    } @else {
      <ul>
        @for (user of users; track user.id) {
          <li (click)="userSelected.emit(user)">
            {{ user.name }}
          </li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Input() loading = false;
  @Output() userSelected = new EventEmitter<User>();
}
```

---

## 2. Services & Dependency Injection

### Injectable Services

```typescript
// ✅ GOOD - Service with inject()
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }
}
```

### Injection Tokens

```typescript
// ✅ GOOD - Injection tokens for config
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiUrl },
  ],
};
```

---

## 3. RxJS Best Practices

### Declarative Streams

```typescript
// ✅ GOOD - Declarative with signals
@Component({...})
export class UsersComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  // Derived state from route params
  private userId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')))
  );

  user = toSignal(
    toObservable(this.userId).pipe(
      filter((id): id is string => id != null),
      switchMap(id => this.userService.getUser(id)),
    )
  );
}
```

### Error Handling

```typescript
// ✅ GOOD - catchError with recovery
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users').pipe(
    retry({ count: 3, delay: 1000 }),
    catchError(error => {
      console.error('Failed to fetch users', error);
      return of([]); // Return empty array on error
    }),
  );
}

// ✅ GOOD - Error handling in component
@Component({...})
export class UsersComponent {
  users$ = this.userService.getUsers().pipe(
    catchError(error => {
      this.errorMessage.set(error.message);
      return EMPTY;
    }),
  );

  errorMessage = signal<string | null>(null);
}
```

### Unsubscribe Patterns

```typescript
// ✅ GOOD - takeUntilDestroyed
@Component({...})
export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.someObservable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        // Handle value
      });
  }
}

// ✅ GOOD - async pipe (auto-unsubscribes)
@Component({
  template: `
    @if (users$ | async; as users) {
      <app-user-list [users]="users" />
    }
  `,
})
export class UsersComponent {
  users$ = this.userService.getUsers();
}
```

---

## 4. State Management (NgRx)

### Feature Store

```typescript
// ✅ GOOD - NgRx feature with createFeature
export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,
    on(UsersActions.loadUsers, state => ({ ...state, loading: true })),
    on(UsersActions.loadUsersSuccess, (state, { users }) => ({
      ...state,
      users,
      loading: false,
    })),
    on(UsersActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
  ),
});

export const {
  selectUsers,
  selectLoading,
  selectError,
} = usersFeature;
```

### Actions

```typescript
// ✅ GOOD - createActionGroup
export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
    'Select User': props<{ userId: string }>(),
  },
});
```

### Effects

```typescript
// ✅ GOOD - Functional effects
export const loadUsers = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      ofType(UsersActions.loadUsers),
      exhaustMap(() =>
        userService.getUsers().pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error =>
            of(UsersActions.loadUsersFailure({ error: error.message }))
          ),
        ),
      ),
    );
  },
  { functional: true },
);
```

---

## 5. Forms

### Reactive Forms

```typescript
// ✅ GOOD - Typed reactive forms
@Component({...})
export class UserFormComponent {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      // value is typed: { email: string; name: string; password: string }
      this.save(value);
    }
  }
}
```

### Template

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div>
    <label for="email">Email</label>
    <input id="email" formControlName="email" type="email">
    @if (form.controls.email.errors?.['required']) {
      <span class="error">Email is required</span>
    }
    @if (form.controls.email.errors?.['email']) {
      <span class="error">Invalid email format</span>
    }
  </div>

  <button type="submit" [disabled]="form.invalid">Submit</button>
</form>
```

---

## 6. Routing

### Lazy Loading

```typescript
// ✅ GOOD - Lazy loaded routes
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./users/user-detail.component').then(m => m.UserDetailComponent),
      },
    ],
  },
];
```

### Route Guards

```typescript
// ✅ GOOD - Functional guards
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
```

### Resolvers

```typescript
// ✅ GOOD - Functional resolver
export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id')!;
  return userService.getUser(userId);
};

// Usage in routes
{
  path: ':id',
  component: UserDetailComponent,
  resolve: { user: userResolver },
}
```

---

## 7. Performance Optimization

### OnPush Change Detection

```typescript
// ✅ GOOD - Always use OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}
```

### trackBy for ngFor

```typescript
// ✅ GOOD - trackBy for lists
@Component({
  template: `
    @for (user of users; track user.id) {
      <app-user-card [user]="user" />
    }
  `,
})
export class UsersComponent {
  users: User[] = [];
}
```

### Defer Loading

```typescript
// ✅ GOOD - Defer heavy components
@Component({
  template: `
    @defer (on viewport) {
      <app-heavy-component />
    } @placeholder {
      <div class="skeleton"></div>
    } @loading {
      <div class="spinner"></div>
    }
  `,
})
export class MyComponent {}
```

---

## 8. HTTP Interceptors

```typescript
// ✅ GOOD - Functional interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

---

## 9. Testing

```typescript
// ✅ GOOD - Component testing
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should display user name', () => {
    component.user = { id: '1', name: 'John', email: 'john@example.com' };
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('h3');
    expect(nameElement.textContent).toContain('John');
  });

  it('should emit when clicked', () => {
    component.user = { id: '1', name: 'John', email: 'john@example.com' };
    jest.spyOn(component.selected, 'emit');

    fixture.nativeElement.querySelector('.user-card').click();

    expect(component.selected.emit).toHaveBeenCalledWith(component.user);
  });
});
```

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

**Version:** 1.3.0
