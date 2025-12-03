# 🧭 React Router DOM - Guia Essencial

> **Analogia Laravel:** React Router é como o sistema de rotas do Laravel (`routes/web.php`), mas para SPAs (Single Page Applications). Ele gerencia navegação **sem recarregar a página**.

---

## 📦 Instalação

```bash
npm install react-router-dom
```

---

## 🎯 Conceitos Fundamentais

### 1️⃣ **BrowserRouter** - O Container Principal

**O que é:** Wrapper que habilita o sistema de rotas na aplicação.

**Analogia Laravel:** É como o `RouteServiceProvider` que inicializa todo sistema de rotas.

```jsx
// main.jsx ou App.jsx
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <App />
</BrowserRouter>;
```

**🔧 Configuração única:** Envolve toda aplicação **UMA VEZ** no arquivo raiz.

---

### 2️⃣ **Routes** - Container de Rotas

**O que é:** Agrupa todas as definições de rotas.

```jsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/login" element={<Login />} />
</Routes>;
```

**Analogia Laravel:**

```php
// Laravel routes/web.php
Route::get('/', [HomeController::class, 'index']);
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/login', [AuthController::class, 'login']);
```

---

### 3️⃣ **Route** - Definição de Rota

**Props principais:**

| Prop      | Tipo    | Descrição               | Exemplo Laravel                    |
| --------- | ------- | ----------------------- | ---------------------------------- |
| `path`    | string  | URL da rota             | `Route::get('/users')`             |
| `element` | JSX     | Componente a renderizar | `[UserController::class, 'index']` |
| `index`   | boolean | Rota padrão do pai      | `Route::redirect('/', '/home')`    |

```jsx
// Rota simples
<Route path="/users" element={<UserList />} />

// Rota com parâmetro (igual {id} no Laravel)
<Route path="/users/:id" element={<UserDetail />} />

// Rota padrão (index)
<Route index element={<Home />} />
```

---

## 🌟 **OUTLET** - O Conceito Mais Importante

### 🤔 O Que É?

**`<Outlet />`** é um **placeholder** onde rotas filhas serão renderizadas.

**Analogia Laravel:** É como `@yield('content')` nas Blade layouts!

### 📋 Exemplo Prático

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  {/* Rota PAI com layout */}
  <Route path="/" element={<AppLayout />}>
    {/* Rotas FILHAS - renderizam dentro do <Outlet /> */}
    <Route index element={<Home />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="profile" element={<Profile />} />
  </Route>

  {/* Rotas SEM layout (login, register) */}
  <Route path="/login" element={<Login />} />
</Routes>;

// AppLayout.jsx (componente PAI)
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div>
      <Header />
      <Sidebar />

      {/* 🎯 Aqui renderiza Home, Dashboard ou Profile */}
      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
```

### 🎨 Fluxo Visual

```
URL: /dashboard

┌─────────────────────────────────┐
│     AppLayout (Rota PAI)        │
│  ┌───────────────────────────┐  │
│  │       <Header />          │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │     <Outlet />            │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  <Dashboard />      │  │  │ ← Rota FILHA
│  │  │  (renderiza aqui)   │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │       <Footer />          │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 🔐 Exemplo Real: ProtectedRoute

**Seu código atual:**

```jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = true; // Verifica JWT token

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet /> {/* Rotas protegidas renderizam AQUI */}
    </AppLayout>
  );
};
```

**Uso no App.jsx:**

```jsx
<Routes>
  {/* Rotas públicas */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Rotas protegidas (precisa estar logado) */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/documents" element={<Documents />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
</Routes>
```

**Analogia Laravel:**

```php
// Laravel - Middleware auth
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'index']);
});
```

**✨ Resultado:**

- Se **NÃO logado** → Redireciona para `/login`
- Se **logado** → Renderiza `<AppLayout>` + componente filho no `<Outlet />`

---

## 🔗 Navegação entre Rotas

### **Link** - Links Normais

**Analogia Laravel:** Como `<a href="{{ route('dashboard') }}">`

```jsx
import { Link } from 'react-router-dom';

// ❌ NÃO use <a href> (recarrega página)
<a href="/dashboard">Dashboard</a>

// ✅ Use <Link> (navegação SPA)
<Link to="/dashboard">Dashboard</Link>
<Link to="/documents/123">Ver Documento</Link>
```

### **NavLink** - Links com Estado Ativo

**Diferença:** Adiciona classe `active` automaticamente quando está na rota.

```jsx
import { NavLink } from 'react-router-dom';

<NavLink
  to="/dashboard"
  className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-gray-500')}
>
  Dashboard
</NavLink>;
```

**Analogia Laravel:**

```blade
{{-- Blade --}}
<a class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">
  Dashboard
</a>
```

---

## 🚀 Navegação Programática

### **useNavigate** - Redirecionar via JavaScript

**Analogia Laravel:** Como `return redirect('/dashboard')`

```jsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await authService.login();
    navigate('/dashboard'); // Redireciona
  };

  return <button onClick={handleLogin}>Entrar</button>;
}
```

**Opções úteis:**

```jsx
navigate('/dashboard'); // Navega
navigate('/dashboard', { replace: true }); // Substitui histórico
navigate(-1); // Volta (igual botão voltar)
navigate(-2); // Volta 2 páginas
```

---

## 🎯 Hooks Essenciais

### 1️⃣ **useParams** - Pegar Parâmetros da URL

**Analogia Laravel:** Como `Route::get('/users/{id}')` e `$request->route('id')`

```jsx
import { useParams } from 'react-router-dom';

// Rota: /documents/:id
<Route path="/documents/:id" element={<DocumentDetail />} />;

// Componente DocumentDetail
function DocumentDetail() {
  const { id } = useParams(); // Pega o :id da URL

  useEffect(() => {
    fetchDocument(id); // Busca documento com esse ID
  }, [id]);

  return <div>Documento #{id}</div>;
}
```

**URL:** `/documents/123` → `id = "123"`

### 2️⃣ **useLocation** - Informações da Rota Atual

**Analogia Laravel:** Como `request()->url()`, `request()->path()`

```jsx
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  console.log(location.pathname); // "/dashboard"
  console.log(location.search); // "?tab=overview"
  console.log(location.hash); // "#section-1"

  return <div>Você está em: {location.pathname}</div>;
}
```

### 3️⃣ **useSearchParams** - Query Strings

**Analogia Laravel:** Como `$request->query('page')`

```jsx
import { useSearchParams } from 'react-router-dom';

function DocumentList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page'); // ?page=2
  const filter = searchParams.get('filter'); // ?filter=pdf

  const goToPage = (pageNum) => {
    setSearchParams({ page: pageNum }); // Atualiza URL
  };

  return <button onClick={() => goToPage(3)}>Ir para Página 3</button>;
}
```

**URL:** `/documents?page=2&filter=pdf`

---

## 🔐 Padrão de Rotas Protegidas

### Estrutura Completa

```jsx
// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* 🌐 Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Rotas Protegidas (com layout) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<DocumentList />} />
        <Route path="/documents/:id" element={<DocumentDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 🏠 Redirect padrão */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 - Rota não encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### ProtectedRoute Component

```jsx
// components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 🔍 Verifica se usuário está logado (JWT no localStorage)
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // ❌ Não autenticado → Redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Autenticado → Renderiza layout + rota filha
  return (
    <AppLayout>
      <Outlet /> {/* Dashboard, Documents, Profile renderizam aqui */}
    </AppLayout>
  );
};

export default ProtectedRoute;
```

**Analogia Laravel:**

```php
// Laravel Middleware
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

---

## 🎨 Padrão de Layout com Outlet

### AppLayout Component

```jsx
// components/layout/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function AppLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar fixa */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header fixo */}
        <Header />

        {/* Conteúdo dinâmico (muda conforme a rota) */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet /> {/* 🎯 Renderiza Dashboard, Documents, etc */}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
```

**Analogia Laravel Blade:**

```blade
{{-- layouts/app.blade.php --}}
<div class="layout">
    @include('partials.sidebar')

    <main>
        @yield('content') {{-- Igual ao <Outlet /> --}}
    </main>
</div>

{{-- views/dashboard.blade.php --}}
@extends('layouts.app')

@section('content')
    <h1>Dashboard</h1>
@endsection
```

---

## 📊 Comparação: Laravel vs React Router

| Laravel                       | React Router                                           | Descrição            |
| ----------------------------- | ------------------------------------------------------ | -------------------- |
| `Route::get('/users')`        | `<Route path="/users" element={<Users />} />`          | Define rota          |
| `Route::get('/users/{id}')`   | `<Route path="/users/:id" element={<UserDetail />} />` | Rota com parâmetro   |
| `$request->route('id')`       | `const { id } = useParams()`                           | Pega parâmetro       |
| `$request->query('page')`     | `searchParams.get('page')`                             | Query string         |
| `return redirect('/home')`    | `navigate('/home')`                                    | Redirecionar         |
| `Route::middleware(['auth'])` | `<Route element={<ProtectedRoute />}>`                 | Rotas protegidas     |
| `@extends('layout')`          | `<Route element={<Layout />}>`                         | Layout wrapper       |
| `@yield('content')`           | `<Outlet />`                                           | Placeholder conteúdo |
| `request()->path()`           | `location.pathname`                                    | URL atual            |
| `route('dashboard')`          | `<Link to="/dashboard">`                               | Link nomeado         |

---

## ✅ Checklist de Uso

### Setup Inicial

- [ ] Instalar: `npm install react-router-dom`
- [ ] Envolver App com `<BrowserRouter>` no `main.jsx`
- [ ] Criar `<Routes>` com `<Route>` no `App.jsx`

### Navegação

- [ ] Usar `<Link>` ao invés de `<a>`
- [ ] Usar `<NavLink>` para menus com estado ativo
- [ ] Usar `useNavigate()` para redirecionamento programático

### Rotas Protegidas

- [ ] Criar componente `ProtectedRoute` com `<Outlet />`
- [ ] Verificar autenticação (JWT token)
- [ ] Redirecionar para `/login` se não autenticado

### Layouts

- [ ] Criar `AppLayout` com Sidebar + Header
- [ ] Usar `<Outlet />` para renderizar conteúdo dinâmico
- [ ] Envolver rotas com layout usando rota pai

### Parâmetros

- [ ] Definir rota: `/documents/:id`
- [ ] Pegar valor: `const { id } = useParams()`
- [ ] Query strings: `useSearchParams()`

---

## 🚀 Exemplo Completo do Projeto

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom';
<BrowserRouter>
  <App />
</BrowserRouter>;

// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

<Routes>
  {/* Públicas */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protegidas */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/documents" element={<DocumentList />} />
    <Route path="/documents/:id" element={<DocumentDetail />} />
    <Route path="/flashcards" element={<FlashcardList />} />
    <Route path="/quizzes/:id" element={<QuizTake />} />
    <Route path="/quizzes/:id/result" element={<QuizResult />} />
    <Route path="/profile" element={<Profile />} />
  </Route>

  {/* Redirect / → /dashboard */}
  <Route path="/" element={<Navigate to="/dashboard" replace />} />

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

---

## 💡 Dicas Importantes

### ✅ Boas Práticas

- **Sempre use `<Link>`** ao invés de `<a>` (mantém SPA)
- **Um `<BrowserRouter>` por app** (coloque no topo)
- **Valide autenticação** no ProtectedRoute
- **Use `replace`** em redirects de auth (evita loop de voltar)

### ❌ Erros Comuns

- Usar `<a href>` ao invés de `<Link>` (recarrega página)
- Esquecer `<Outlet />` em rotas pai (filhas não renderizam)
- Múltiplos `<BrowserRouter>` (causa conflito)
- Não verificar autenticação (rotas expostas)

---

## 🎯 Resumo Executivo

**React Router DOM** gerencia navegação em SPAs sem recarregar página.

**Componentes Essenciais:**

- `<BrowserRouter>` → Habilita sistema de rotas
- `<Routes>` → Agrupa rotas
- `<Route>` → Define uma rota
- `<Link>` → Link sem reload
- `<Outlet />` → Placeholder para rotas filhas (igual `@yield` Laravel)

**Hooks Úteis:**

- `useNavigate()` → Redirecionar programaticamente
- `useParams()` → Pegar `:id` da URL
- `useLocation()` → Info da rota atual
- `useSearchParams()` → Query strings

**Padrão de Segurança:**

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

---

**📚 Documentação Oficial:** https://reactrouter.com/

---

✨ **Criado para Fernando - Estudos MERN Stack**
