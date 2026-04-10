---
name: laravel-expert
description: "Laravel/PHP backend expert. PROACTIVELY use when working with Laravel, PHP APIs, Eloquent ORM. Triggers: laravel, php, eloquent, artisan"
autoInvoke: false
priority: high
triggers:
  - "laravel"
  - "php"
  - "eloquent"
  - "artisan"
  - "blade"
  - "sanctum"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Laravel Expert Skill

Laravel patterns: PHP 8.2+, Eloquent ORM, API development.

---

## 1. Eloquent Best Practices

**Prevent N+1:** `User::with('posts')->get()` or `User::withCount('posts')->get()`.

**Efficient queries:**
- Select only needed: `User::select(['id', 'name', 'email'])->get()`
- Use `exists()` not `count()` for checks
- `chunk(1000)` or `cursor()` for large datasets
- `updateOrCreate`, `increment/decrement` for atomic ops
- `insert()` for bulk (not create in loop)

**Conditional queries:**
```php
User::query()
    ->when($request->status, fn($q, $status) => $q->where('status', $status))
    ->when($request->search, fn($q, $search) => $q->where('name', 'like', "%{$search}%"))
    ->get();
```

---

## 2. Controller Pattern

Thin controllers: inject Service, validate with FormRequest, return JsonResource.

```php
public function store(CreateUserRequest $request): JsonResponse
{
    $user = $this->userService->createUser($request->validated());
    return response()->json(['data' => new UserResource($user)], 201);
}
```

---

## 3. Service + DTO Pattern

Business logic in services. Use `readonly class` DTOs (PHP 8.2+). Wrap multi-step ops in `DB::transaction()`.

---

## 4. Request Validation

Use `FormRequest` with `rules()`, `messages()`, `prepareForValidation()`. Combine with `Password::defaults()`.

---

## 5. API Resources

`JsonResource::toArray()` with `whenLoaded()` for conditional relations, `when()` for conditional fields.

---

## 6. Error Handling

Custom `BusinessException` with `code`, `statusCode`, `render()` method. Handler: check `$request->expectsJson()` for JSON error responses.

---

## 7. Queue Jobs

`implements ShouldQueue` with `$tries`, `$timeout`, `backoff()`, `failed()`. Dispatch with `->onQueue()` or `->delay()`.

---

## 8. Caching

`Cache::remember(key, ttl, fn)`. Use `Cache::tags()` for group invalidation. Model event hooks (`saved`, `deleted`) for cache clearing.

---

## 9. Authorization

Policies: `PostPolicy::update(User $user, Post $post)`. Controller: `$this->authorize('update', $post)`. Sanctum: `createToken('name', ['ability'])`.

---

## 10. Testing

- **Feature tests:** `RefreshDatabase`, `postJson`, `assertStatus`, `assertJson`, `assertDatabaseHas`
- **Pest:** `it('creates user', fn() => ...)` with `dataset()` for parametrized tests

---

## Quick Reference

```toon
checklist[12]{pattern,best_practice}:
  N+1,with() or withCount() eager loading
  Queries,whereIn over OR conditions
  Atomic,increment/decrement/updateOrCreate
  Bulk,insert() over create() loops
  Validate,FormRequest classes
  Resources,JsonResource with whenLoaded
  Services,Business logic in service layer
  DTOs,readonly classes PHP 8.2+
  Jobs,ShouldQueue + backoff + failed
  Cache,Cache::remember with tags
  Auth,Policies for authorization
  Tests,RefreshDatabase + assertJson
```

---
