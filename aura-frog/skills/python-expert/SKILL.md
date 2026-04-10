---
name: python-expert
description: "Python backend expert. PROACTIVELY use when working with Django, FastAPI, Flask, Python APIs. Triggers: python, django, fastapi, flask, async python"
autoInvoke: false
priority: high
triggers:
  - "python"
  - "django"
  - "fastapi"
  - "flask"
  - "pydantic"
  - "sqlalchemy"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Python Expert Skill

Python backend patterns: Django, FastAPI, Flask, async, SQLAlchemy.

---

## 1. FastAPI Patterns

**Pydantic models:** `BaseModel` with `Field`, `EmailStr`, `field_validator`. Config: `str_strip_whitespace`.

**DI:** `Depends()` for shared logic. Use `Annotated` type aliases:
```python
CurrentUser = Annotated[User, Depends(get_current_user)]
DB = Annotated[AsyncSession, Depends(get_db)]
```

**Background tasks:** `BackgroundTasks.add_task(fn, args)` for non-blocking ops.

**Exception handling:** Custom `AppException` + `@app.exception_handler(AppException)`.

**Lifespan:** `@asynccontextmanager` with `yield` for startup/shutdown.

---

## 2. Django Patterns

- **N+1:** `select_related('fk')` for FK, `prefetch_related('m2m')` for M2M
- **Atomic updates:** `F('views') + 1` (not read-modify-write)
- **Complex queries:** `Q(a=True) | Q(b=True)`
- **Existence:** `.exists()` not `len(qs) > 0`
- **Bulk:** `bulk_create([...])` not create in loop
- **Transactions:** `@transaction.atomic`

---

## 3. SQLAlchemy 2.0

**Declarative:** `Mapped[type]` + `mapped_column()` + `relationship()`.

**Async:** `select(User).where(User.id == id)` + `await db.execute(stmt)`.

**Eager loading:** `selectinload` (separate query) / `joinedload` (JOIN).

**Pagination:** `func.count()` for total + `offset/limit` for page.

---

## 4. Async Best Practices

- `asyncio.gather()` for parallel ops
- `asyncio.timeout()` for timeouts
- `asyncio.Semaphore(N)` for rate limiting
- `asyncio.TaskGroup()` (3.11+) for structured concurrency

---

## 5. Type Hints (3.10+)

```python
def get_users(active: bool | None = None) -> list[User]: ...

class Repository(Protocol):
    async def get(self, id: int) -> Model | None: ...
```

Use `TypeVar` for generics, `Protocol` for structural typing.

---

## 6. Testing

- **Fixtures:** `@pytest.fixture` with async client and session rollback
- **Parametrize:** `@pytest.mark.parametrize("input,expected", [...])`
- **Factories:** `factory.Factory` with `Faker` fields
- **Mocking:** `AsyncMock` + `patch()`

---

## 7. Error Handling

Custom exception hierarchy: `AppError` base with `code`, `NotFoundError`, `ValidationError`. Result pattern: `Ok[T] | Err[E]` with `match` statement.

---

## Quick Reference

```toon
checklist[12]{pattern,best_practice}:
  FastAPI,Pydantic models + Depends injection
  Django ORM,select_related/prefetch_related
  SQLAlchemy,Mapped types + selectinload
  Async,asyncio.gather for parallel
  Typing,Modern 3.10+ syntax X | None
  Testing,pytest fixtures + parametrize
  Validation,Pydantic or Django Forms
  Errors,Custom exception hierarchy
  Transactions,atomic or db.transaction
  Queries,F() objects for atomic updates
  Bulk,bulk_create over loops
  Cache,Redis or Django cache
```

---
