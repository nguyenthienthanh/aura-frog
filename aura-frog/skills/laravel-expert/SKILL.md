---
name: laravel-expert
description: "Laravel/PHP backend expert. PROACTIVELY use when working with Laravel, PHP APIs, Eloquent ORM. Triggers: laravel, php, eloquent, artisan"
autoInvoke: true
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

Expert-level Laravel patterns for PHP 8.2+, Eloquent ORM, and API development.

---

## Auto-Detection

This skill activates when:
- Working with Laravel projects
- Detected `laravel/framework` in composer.json
- Working with `*.php` files in Laravel structure
- Using Eloquent, Artisan, or Laravel packages

---

## 1. Eloquent Best Practices

### Prevent N+1 Queries

```php
// ❌ BAD - N+1 queries
$users = User::all();
foreach ($users as $user) {
    echo $user->posts->count(); // 1 query per user!
}

// ✅ GOOD - Eager loading
$users = User::with('posts')->get();
foreach ($users as $user) {
    echo $user->posts->count(); // No extra query
}

// ✅ GOOD - Count without loading
$users = User::withCount('posts')->get();
foreach ($users as $user) {
    echo $user->posts_count;
}
```

### Efficient Queries

```php
// ✅ GOOD - Select only needed columns
$users = User::select(['id', 'name', 'email'])->get();

// ✅ GOOD - Use exists() not count()
if (User::where('email', $email)->exists()) {
    // ...
}

// ✅ GOOD - Chunking large datasets
User::chunk(1000, function ($users) {
    foreach ($users as $user) {
        // Process
    }
});

// ✅ GOOD - Cursor for memory efficiency
foreach (User::cursor() as $user) {
    // Processes one at a time
}
```

### Atomic Operations

```php
// ✅ GOOD - updateOrCreate for upserts
User::updateOrCreate(
    ['email' => $email],
    ['name' => $name, 'role' => $role]
);

// ✅ GOOD - Atomic increment/decrement
$post->increment('views');
$user->decrement('credits', 10);

// ✅ GOOD - Bulk operations
User::insert([
    ['name' => 'John', 'email' => 'john@example.com'],
    ['name' => 'Jane', 'email' => 'jane@example.com'],
]);
```

### Query Optimization

```php
// ✅ GOOD - whereIn over multiple OR
User::whereIn('status', ['active', 'pending', 'review'])->get();

// ✅ GOOD - Conditional queries
User::query()
    ->when($request->status, fn($q, $status) => $q->where('status', $status))
    ->when($request->search, fn($q, $search) => $q->where('name', 'like', "%{$search}%"))
    ->get();

// ✅ GOOD - Subqueries
$users = User::addSelect([
    'last_login' => Login::select('created_at')
        ->whereColumn('user_id', 'users.id')
        ->latest()
        ->limit(1)
])->get();
```

---

## 2. Controller Patterns

### RESTful Controller

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();

        return response()->json([
            'data' => UserResource::collection($users),
        ]);
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return response()->json([
            'data' => new UserResource($user),
            'message' => 'User created successfully',
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($user->load('posts')),
        ]);
    }
}
```

---

## 3. Service Pattern

```php
<?php

namespace App\Services;

use App\Models\User;
use App\DTOs\CreateUserDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function createUser(CreateUserDTO $dto): User
    {
        return DB::transaction(function () use ($dto) {
            $user = User::create([
                'name' => $dto->name,
                'email' => $dto->email,
                'password' => Hash::make($dto->password),
            ]);

            $this->notificationService->sendWelcomeEmail($user);

            return $user;
        });
    }
}
```

### DTOs (PHP 8.2+)

```php
<?php

readonly class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(CreateUserRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            password: $request->validated('password'),
        );
    }
}
```

---

## 4. Request Validation

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['sometimes', 'string', 'in:user,admin,moderator'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower($this->email),
            'name' => trim($this->name),
        ]);
    }
}
```

---

## 5. API Resources

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'created_at' => $this->created_at->toISOString(),
            // Conditional relationships
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'posts_count' => $this->when(isset($this->posts_count), $this->posts_count),
            // Auth-based fields
            'is_admin' => $this->when($request->user()?->isAdmin(), $this->is_admin),
        ];
    }
}
```

---

## 6. Error Handling

```php
<?php

namespace App\Exceptions;

use Exception;

class BusinessException extends Exception
{
    public function __construct(
        string $message,
        public readonly string $code = 'BUSINESS_ERROR',
        public readonly int $statusCode = 400,
    ) {
        parent::__construct($message);
    }

    public function render($request)
    {
        return response()->json([
            'message' => $this->getMessage(),
            'code' => $this->code,
        ], $this->statusCode);
    }
}
```

### Handler Configuration

```php
// app/Exceptions/Handler.php
public function render($request, Throwable $e)
{
    if ($request->expectsJson()) {
        if ($e instanceof ValidationException) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->json([
                'message' => 'Resource not found',
            ], 404);
        }
    }

    return parent::render($request, $e);
}
```

---

## 7. Queue Jobs

```php
<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 30;

    public function __construct(
        public readonly User $user,
    ) {}

    public function handle(MailService $mailService): void
    {
        $mailService->sendWelcomeEmail($this->user);
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Failed to send welcome email', [
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);
    }

    public function backoff(): array
    {
        return [60, 120, 300]; // 1min, 2min, 5min
    }
}

// Dispatch
SendWelcomeEmail::dispatch($user);
SendWelcomeEmail::dispatch($user)->onQueue('emails');
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));
```

---

## 8. Caching

```php
// ✅ GOOD - Cache expensive queries
$users = Cache::remember('users.active', 3600, function () {
    return User::where('status', 'active')->get();
});

// ✅ GOOD - Cache tags for invalidation
$posts = Cache::tags(['posts', 'user.'.$userId])->remember(
    "user.{$userId}.posts",
    3600,
    fn() => Post::where('user_id', $userId)->get()
);

// Invalidate
Cache::tags(['user.'.$userId])->flush();

// ✅ GOOD - Model cache invalidation
class User extends Model
{
    protected static function booted(): void
    {
        static::saved(fn($user) => Cache::forget("user.{$user->id}"));
        static::deleted(fn($user) => Cache::forget("user.{$user->id}"));
    }
}
```

---

## 9. Authorization

### Policies

```php
<?php

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }
}

// In controller
public function update(UpdatePostRequest $request, Post $post)
{
    $this->authorize('update', $post);
    // ...
}
```

### Sanctum Abilities

```php
$user->createToken('api-token', ['posts:read', 'posts:write']);
```

---

## 10. Testing

### Feature Tests

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_user(): void
    {
        $response = $this->postJson('/api/users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);
    }
}
```

### Pest Tests

```php
<?php

use App\Models\User;

it('creates a user', function () {
    $response = $this->postJson('/api/users', [
        'name' => 'John',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201);
    expect(User::where('email', 'john@example.com')->exists())->toBeTrue();
});

dataset('invalid_emails', ['invalid', '', 'missing@', '@domain.com']);

it('rejects invalid emails', function (string $email) {
    $response = $this->postJson('/api/users', [
        'name' => 'John',
        'email' => $email,
        'password' => 'password123',
    ]);

    $response->assertStatus(422);
})->with('invalid_emails');
```

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

**Version:** 1.3.0
