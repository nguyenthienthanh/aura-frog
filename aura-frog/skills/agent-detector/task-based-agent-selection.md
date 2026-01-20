# Task-Based Agent Selection

**Version:** 1.0.0
**Purpose:** Select agents based on task content, not just repository type

---

## Why Task-Based Selection?

Repository type ≠ Task type. A backend repo may contain:
- HTML templates (Blade, Twig, Jinja, EJS)
- PDF generation with HTML/CSS
- Email templates with styling
- Admin dashboards
- Server-side rendered views

Similarly, a frontend repo may require:
- API endpoint changes
- Database queries
- Background job logic
- Authentication logic

**Task content analysis ensures the right agent handles the right task.**

---

## Task Content Analysis Patterns

### Frontend Tasks (Activate: web-expert, ui-designer)

**Triggers regardless of repo type:**

```toon
frontend_task_patterns[18]{pattern,description,score}:
  html template,HTML template creation/modification,+55
  blade template,Laravel Blade template,+55
  twig template,Symfony Twig template,+55
  jinja template,Python Jinja2 template,+55
  ejs template,Node.js EJS template,+55
  handlebars,Handlebars template,+55
  pug/jade template,Pug/Jade template,+55
  email template,Email HTML/CSS template,+55
  pdf generation,PDF with HTML/CSS (wkhtmltopdf/puppeteer),+50
  pdf styling,Styling PDF output,+50
  css/styling,CSS/SCSS styling changes,+55
  tailwind,Tailwind CSS classes,+55
  responsive,Responsive design work,+50
  layout/grid,Layout or grid work,+50
  ui component,UI component work,+50
  form design,Form layout/design,+50
  admin panel ui,Admin dashboard UI,+50
  svg/icon,SVG or icon work,+45
```

**File-based triggers (task mentions these):**

```toon
frontend_file_patterns[12]{pattern,indicates,score}:
  *.blade.php,Laravel Blade view,+50
  *.twig,Symfony Twig view,+50
  *.jinja/*.jinja2,Python Jinja template,+50
  *.ejs,EJS template,+50
  *.hbs/*.handlebars,Handlebars template,+50
  *.pug/*.jade,Pug/Jade template,+50
  resources/views/*,Laravel views directory,+45
  templates/*,General templates directory,+45
  email/*.html,Email templates,+50
  pdf/*.html,PDF templates,+50
  *.css/*.scss/*.sass,Stylesheet files,+45
  public/*.html,Static HTML files,+45
```

**Keyword triggers:**

```toon
frontend_keywords[15]{keyword,context,score}:
  style/styling,CSS/appearance work,+40
  layout,Page/component layout,+40
  responsive,Mobile responsiveness,+40
  flexbox/grid,CSS layout patterns,+45
  animation,CSS/JS animations,+40
  dark mode/theme,Theming work,+40
  modal/dialog,UI modal component,+35
  form/input,Form elements,+35
  button/link,Interactive elements,+30
  header/footer,Page sections,+30
  sidebar/nav,Navigation elements,+30
  table/list,Data display elements,+30
  card/panel,Container elements,+30
  toast/notification,Alert elements,+30
  loading/spinner,Loading states,+30
```

---

### Backend Tasks (Activate: backend-*, database-specialist)

**Triggers regardless of repo type:**

```toon
backend_task_patterns[20]{pattern,description,score}:
  api endpoint,API route/endpoint work,+55
  controller logic,Controller business logic,+55
  service layer,Service class work,+50
  repository pattern,Repository implementation,+50
  middleware,HTTP middleware,+50
  authentication,Auth logic (not UI),+50
  authorization,Permission/role logic,+50
  validation,Server-side validation,+45
  rate limiting,API rate limiting,+45
  caching,Server-side caching,+45
  queue/job,Background job/queue,+50
  cron/scheduled,Scheduled task logic,+50
  webhook,Webhook handler,+50
  oauth/jwt,Token handling,+50
  password hash,Password security,+45
  session,Session management,+45
  logging,Server logging,+40
  error handling,Backend error handling,+40
  file upload,Server-side file handling,+45
  email sending,Email dispatch (not template),+45
```

**API/Business logic keywords:**

```toon
backend_keywords[15]{keyword,context,score}:
  request/response,HTTP handling,+40
  json/serialize,Data serialization,+35
  validate,Server validation,+35
  sanitize,Input sanitization,+35
  encrypt/decrypt,Encryption logic,+40
  hash,Password/data hashing,+35
  cache/redis,Caching layer,+40
  queue/worker,Job queue,+40
  event/listener,Event handling,+35
  notification,Server notifications,+35
  mail/smtp,Email sending,+35
  storage/s3,File storage,+35
  stream,Data streaming,+35
  pagination,Server pagination,+30
  filter/sort,Query filtering,+30
```

---

### Database Tasks (Activate: database-specialist)

**Triggers regardless of repo type:**

```toon
database_task_patterns[18]{pattern,description,score}:
  migration,Database migration,+60
  schema,Database schema design,+60
  table/column,Table structure changes,+55
  index/indexing,Database indexing,+55
  foreign key,Relationship constraints,+55
  query optimization,Query performance,+55
  sql/raw query,Direct SQL work,+55
  eloquent/orm,ORM query building,+50
  relationship,Model relationships,+50
  join/eager load,Query joining,+50
  transaction,Database transactions,+50
  seeder/factory,Test data creation,+45
  backup/restore,Database backup,+45
  deadlock,Concurrency issues,+50
  n+1 problem,Query optimization,+50
  slow query,Performance debugging,+50
  postgres/mysql,Database-specific work,+45
  connection pool,Connection management,+45
```

**Database keywords:**

```toon
database_keywords[12]{keyword,context,score}:
  select/insert/update/delete,CRUD operations,+40
  where/having,Query conditions,+35
  group by/order by,Query aggregation,+35
  count/sum/avg,Aggregate functions,+35
  distinct/unique,Query filtering,+30
  limit/offset,Pagination,+30
  cascade/restrict,FK behavior,+35
  nullable/default,Column constraints,+30
  timestamp/datetime,Date handling,+25
  soft delete,Deletion strategy,+30
  uuid/primary key,Key strategy,+30
  enum/type,Column types,+25
```

---

### Security Tasks (Activate: security-expert)

**Triggers regardless of repo type:**

```toon
security_task_patterns[15]{pattern,description,score}:
  xss/cross-site,XSS vulnerability,+60
  sql injection,SQL injection,+60
  csrf,CSRF protection,+55
  cors,CORS configuration,+50
  owasp,Security standards,+55
  vulnerability,Security vulnerability,+55
  penetration/pentest,Security testing,+55
  auth bypass,Authentication bypass,+60
  privilege escalation,Permission issues,+60
  secure cookie,Cookie security,+50
  content security policy,CSP headers,+50
  rate limit abuse,Rate limiting security,+50
  input validation security,Input security,+45
  file upload security,Upload vulnerabilities,+50
  secrets/credentials,Secret management,+55
```

---

### DevOps Tasks (Activate: devops-cicd)

**Triggers regardless of repo type:**

```toon
devops_task_patterns[15]{pattern,description,score}:
  docker/dockerfile,Container configuration,+55
  kubernetes/k8s,K8s configuration,+55
  ci/cd pipeline,Pipeline work,+55
  github actions,GH Actions workflow,+55
  terraform,Infrastructure as code,+55
  nginx/apache,Web server config,+50
  ssl/tls certificate,SSL configuration,+50
  load balancer,Load balancing,+50
  auto scaling,Scaling configuration,+50
  monitoring/alerting,Observability,+50
  log aggregation,Logging infrastructure,+45
  environment variables,Env configuration,+40
  deployment script,Deploy automation,+50
  rollback,Deployment rollback,+45
  blue-green/canary,Deployment strategy,+50
```

---

### Testing Tasks (Activate: qa-automation)

**Triggers regardless of repo type:**

```toon
testing_task_patterns[12]{pattern,description,score}:
  unit test,Unit testing,+55
  integration test,Integration testing,+55
  e2e test,End-to-end testing,+55
  test coverage,Coverage improvement,+50
  mock/stub,Test doubles,+45
  fixture,Test data setup,+45
  assertion,Test assertions,+40
  test failure,Fixing failing tests,+50
  flaky test,Unstable test fixing,+50
  test refactor,Test code improvement,+45
  snapshot test,Snapshot testing,+45
  visual regression,Visual testing,+45
```

---

### UI/Design Tasks (Activate: ui-designer)

**Triggers regardless of repo type:**

```toon
design_task_patterns[12]{pattern,description,score}:
  figma/sketch,Design tool work,+60
  wireframe,Wireframe creation,+55
  mockup,Design mockup,+55
  design system,Design system work,+55
  component library,UI library work,+50
  color palette,Color scheme,+50
  typography,Font/text styling,+50
  spacing/padding,Layout spacing,+45
  accessibility/a11y,Accessibility improvements,+55
  usability,UX improvements,+50
  user flow,UX flow design,+50
  prototype,Interactive prototype,+50
```

---

## Task Analysis Algorithm

```
TASK_ANALYSIS(user_message, mentioned_files):

1. EXTRACT task-related patterns from message
   - Identify action verbs (create, fix, update, add)
   - Identify domain nouns (template, api, query, test)
   - Identify tech references (blade, eloquent, react)

2. SCORE each agent category
   For each pattern in message:
     If pattern matches frontend_task_patterns → frontend_score += score
     If pattern matches backend_task_patterns → backend_score += score
     If pattern matches database_task_patterns → database_score += score
     If pattern matches security_task_patterns → security_score += score
     If pattern matches devops_task_patterns → devops_score += score
     If pattern matches testing_task_patterns → testing_score += score
     If pattern matches design_task_patterns → design_score += score

3. ANALYZE mentioned files (if any)
   For each file mentioned or targeted:
     If file matches frontend_file_patterns → frontend_score += score
     (Apply similar for other categories)

4. APPLY thresholds
   - Score ≥50: Activate as PRIMARY (overrides repo-based selection)
   - Score 30-49: Activate as SECONDARY (alongside repo-based)
   - Score <30: Use repo-based selection only

5. COMBINE with repo-based detection
   Final agents = Union(task_based_agents, repo_based_agents)
   Prioritize task-based when conflict exists
```

---

## Examples

### Example 1: Backend Repo, Frontend Task

**Context:** Laravel backend API project
**Task:** "Update the email template styling for password reset"

**Analysis:**
- "email template" → frontend_task_patterns (+55)
- "styling" → frontend_keywords (+40)
- "password reset" → backend context, but task is frontend

**Result:**
- **Primary:** web-expert (95 pts) - handles template styling
- **Secondary:** backend-laravel (40 pts) - repo context
- **Approach:** web-expert leads, backend-laravel advises on Laravel Blade

---

### Example 2: Backend Repo, PDF Generation

**Context:** Node.js API project
**Task:** "Fix the invoice PDF layout - items table is breaking across pages"

**Analysis:**
- "PDF" → frontend_task_patterns (+50)
- "layout" → frontend_keywords (+40)
- "table" → frontend_keywords (+30)
- "breaking across pages" → CSS/layout issue

**Result:**
- **Primary:** web-expert (120 pts) - CSS/HTML for PDF
- **Secondary:** backend-nodejs (40 pts) - integration
- **Approach:** web-expert fixes HTML/CSS, backend handles PDF library

---

### Example 3: Frontend Repo, API Task

**Context:** Next.js frontend project
**Task:** "Add rate limiting to the API route"

**Analysis:**
- "rate limiting" → backend_task_patterns (+45)
- "API route" → backend_task_patterns (+55)

**Result:**
- **Primary:** backend-nodejs (100 pts) - API logic
- **Secondary:** web-nextjs (40 pts) - Next.js API routes context
- **Approach:** backend-nodejs leads API implementation

---

### Example 4: Full-Stack, Database Task

**Context:** Laravel + Vue project
**Task:** "Optimize the slow query on the users report page"

**Analysis:**
- "slow query" → database_task_patterns (+50)
- "optimize" → database context
- "report page" → slight frontend context

**Result:**
- **Primary:** database-specialist (90 pts) - query optimization
- **Secondary:** backend-laravel (40 pts), web-vuejs (20 pts)
- **Approach:** database-specialist leads, backend assists

---

## Integration with Existing Detection

This task-based analysis **enhances** existing detection:

```
1. Run existing Layer 1-4 detection (repo-based)
2. Run task content analysis (this module)
3. Merge results:
   - Task-based score ≥50 → Override or co-lead
   - Task-based score 30-49 → Add as secondary
   - Task-based score <30 → Keep repo-based only
4. Show combined agents in banner
```

---

**Related:** `agent-detector/SKILL.md`, `agents/smart-agent-detector.md`
