# Skill: Laravel Patterns & Best Practices

**Category:** Dev Expert  
**Priority:** High  
**Used By:** backend-laravel agent

---

## Core Patterns

### 1. MVC Architecture

```php
// routes/api.php
Route::apiResource('users', UserController::class);

// app/Http/Controllers/UserController.php
class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::all());
    }
    
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());
        return new UserResource($user);
    }
}

// app/Http/Requests/StoreUserRequest.php
class StoreUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ];
    }
}

// app/Http/Resources/UserResource.php
class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

### 2. Eloquent ORM

```php
// app/Models/User.php
class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean',
    ];
    
    // Relationships
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
    
    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Accessors
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}

// Usage
$users = User::active()->with('posts')->get();
$fullName = $user->full_name; // Uses accessor
```

### 3. Service Pattern

```php
// app/Services/UserService.php
class UserService
{
    public function __construct(
        private UserRepository $repository,
        private MailService $mailService
    ) {}
    
    public function createUser(array $data): User
    {
        DB::beginTransaction();
        try {
            $user = $this->repository->create($data);
            $this->mailService->sendWelcomeEmail($user);
            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

// Controller uses Service
public function store(StoreUserRequest $request, UserService $service)
{
    $user = $service->createUser($request->validated());
    return new UserResource($user);
}
```

### 4. Repository Pattern

```php
// app/Repositories/UserRepository.php
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function create(array $data): User;
}

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }
    
    public function create(array $data): User
    {
        return User::create($data);
    }
}

// Register in AppServiceProvider
$this->app->bind(UserRepositoryInterface::class, UserRepository::class);
```

### 5. Jobs & Queues

```php
// app/Jobs/ProcessUserImport.php
class ProcessUserImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(private array $data) {}
    
    public function handle()
    {
        foreach ($this->data as $row) {
            User::create($row);
        }
    }
}

// Dispatch
ProcessUserImport::dispatch($data);
ProcessUserImport::dispatch($data)->onQueue('imports');
```

### 6. API Authentication (Sanctum)

```php
// config/sanctum.php configured

// Register
$user = User::create($data);
$token = $user->createToken('auth_token')->plainTextToken();

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

### 7. Testing

```php
// tests/Feature/UserControllerTest.php
class UserControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_can_create_user()
    {
        $response = $this->postJson('/api/users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);
        
        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'name', 'email']);
        
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);
    }
}
```

---

## Best Practices

### Do's ✅
- ✅ Use Form Requests for validation
- ✅ Use API Resources for responses
- ✅ Implement Service layer for business logic
- ✅ Use Eloquent relationships
- ✅ Queue heavy tasks
- ✅ Write tests

### Don'ts ❌
- ❌ Put business logic in controllers
- ❌ Use raw SQL without bindings
- ❌ Forget to validate input
- ❌ Ignore N+1 query problems

---

**Used by backend-laravel agent for Laravel API development guidance.**

