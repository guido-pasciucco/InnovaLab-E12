# Guía personal — Git y flujo de trabajo en proyectos

Esta guía está pensada para vos como integrante del equipo de Data/IA.
Cubrimos desde cómo entrar a un proyecto nuevo hasta el flujo diario de trabajo.

---

## PARTE 1 — Entrar a un proyecto nuevo por primera vez

### Paso 1 — Clonar el repositorio

Abrís una terminal en la carpeta donde querés guardar el proyecto y ejecutás:

```powershell
git clone https://github.com/USUARIO/NOMBRE-REPO.git
```

Ejemplo real de este proyecto:
```powershell
git clone https://github.com/guido-pasciucco/InnovaLab-E12.git
```

Esto descarga todo el proyecto a tu máquina en una carpeta nueva.

---

### Paso 2 — Entrar a la carpeta del proyecto

```powershell
cd NOMBRE-REPO
# ejemplo:
cd InnovaLab-E12
```

---

### Paso 3 — Ver qué ramas existen

```powershell
git branch -a
```

Vas a ver algo así:
```
* main
  remotes/origin/main
  remotes/origin/develop
  remotes/origin/feature/algo
```

Las que dicen `remotes/origin/` son las ramas de tus compañeros en GitHub.
El `*` marca en qué rama estás vos ahora.

---

### Paso 4 — Pararte en la rama base de trabajo (casi siempre `develop`)

```powershell
git checkout develop
```

Siempre trabajás desde `develop`, nunca desde `main`.
`main` es la versión estable y no se toca directamente.

---

### Paso 5 — Crear tu propia rama de trabajo

```powershell
git checkout -b feature/nombre-descriptivo
```

Ejemplos según el tipo de tarea:
```powershell
git checkout -b feature/data-ia          # para tareas de Data e IA
git checkout -b feature/dashboard        # para el dashboard de Power BI
git checkout -b feature/queries-sprint3  # para las queries del sprint 3
git checkout -b fix/correccion-indicador # para correcciones
```

**Regla:** el nombre de la rama debe describir QUÉ estás haciendo, no quién sos.

---

### Paso 6 — Subir tu rama al repositorio remoto (GitHub)

La primera vez que querés que tus compañeros vean tu rama:

```powershell
git push -u origin feature/nombre-descriptivo
```

El `-u` hace que las próximas veces alcance con solo `git push`.

---

## PARTE 2 — Flujo de trabajo diario

### Empezar a trabajar cada día

**1. Traer los cambios que hicieron tus compañeros:**
```powershell
git fetch --all
```

**2. Ver si hay commits nuevos:**
```powershell
git log --oneline --all
```
Los commits que no conocías son los nuevos. Fijate especialmente en `origin/develop` y `origin/feature/backend`.

**3. Actualizar tu rama con los últimos cambios de develop** (hacer esto seguido evita conflictos grandes):
```powershell
git merge origin/develop
```

---

### Guardar tu trabajo (hacer commit)

**1. Ver qué archivos modificaste:**
```powershell
git status
```

**2. Agregar los archivos que querés guardar:**
```powershell
# Un archivo específico (recomendado):
git add data/mi-archivo.md

# Todos los archivos modificados (usar con cuidado):
git add .
```

**3. Crear el commit con un mensaje descriptivo:**
```powershell
git commit -m "data: descripcion corta de lo que hice"
```

Ejemplos de buenos mensajes:
```
data: agrega queries de ocupacion de espacios sprint3
data: actualiza validacion modelo con cambios de backend
data: agrega datos de prueba para dashboard power bi
fix: corrige calculo de horas en indicador de utilizacion
```

**4. Subir tus cambios a GitHub:**
```powershell
git push
```

---

### Ver qué hicieron tus compañeros en una rama

```powershell
# Ver los commits de la rama de backend:
git log --oneline origin/feature/backend

# Ver qué archivos tocó un commit específico:
git show --stat CODIGO_COMMIT
# ejemplo:
git show --stat 5b89188

# Ver el contenido de un archivo en otra rama sin cambiarte:
git show origin/feature/backend:back/database/migrations/nombre-archivo.php
```

---

## PARTE 3 — Situaciones comunes

### "Quiero ver los cambios de develop sin perder mi trabajo"

```powershell
# Guardás tu trabajo temporalmente:
git stash

# Ves lo que necesitás en develop:
git checkout develop
git pull

# Volvés a tu rama:
git checkout feature/mi-rama

# Recuperás tu trabajo guardado:
git stash pop
```

---

### "Quiero saber en qué rama estoy"

```powershell
git branch
```
La que tiene `*` es la tuya.

---

### "Hice cambios en el archivo equivocado"

Si todavía NO hiciste commit:
```powershell
# Descartar cambios en un archivo específico:
git checkout -- nombre-del-archivo.md
```

Si YA hiciste commit pero NO pusheaste:
```powershell
# Volver al commit anterior (sin perder los archivos):
git reset --soft HEAD~1
```

---

### "Mis compañeros mergearon cosas a develop y quiero tenerlas"

```powershell
git fetch --all
git merge origin/develop
```

Si hay conflictos (dos personas editaron el mismo archivo), Git te avisa.
Los conflictos se ven así en el archivo:
```
<<<<<<< HEAD
tu versión
=======
versión de tu compañero
>>>>>>> origin/develop
```
Editás el archivo, quedándote con lo correcto, guardás, y hacés:
```powershell
git add nombre-archivo
git commit -m "merge: resuelvo conflicto en nombre-archivo"
```

---

### "Quiero comparar mi rama con develop antes de hacer merge"

```powershell
git diff feature/mi-rama origin/develop
```

---

## PARTE 4 — Comandos de referencia rápida

| ¿Qué querés hacer? | Comando |
|---|---|
| Clonar un proyecto | `git clone URL` |
| Ver en qué rama estás | `git branch` |
| Ver todas las ramas | `git branch -a` |
| Cambiar de rama | `git checkout nombre-rama` |
| Crear rama nueva | `git checkout -b nombre-rama` |
| Traer cambios remotos | `git fetch --all` |
| Ver commits recientes | `git log --oneline --all` |
| Ver archivos modificados | `git status` |
| Agregar archivo al commit | `git add archivo` |
| Guardar commit | `git commit -m "mensaje"` |
| Subir cambios | `git push` |
| Primera vez que subís una rama | `git push -u origin nombre-rama` |
| Actualizar tu rama con develop | `git merge origin/develop` |
| Ver qué tocó un commit | `git show --stat HASH` |
| Guardar trabajo temporalmente | `git stash` |
| Recuperar trabajo guardado | `git stash pop` |

---

## PARTE 5 — Reglas del equipo (buenas prácticas)

1. **Nunca trabajar directo en `main` o `develop`** — siempre en tu propia rama `feature/`.
2. **Commits chicos y frecuentes** — mejor 5 commits chicos que 1 commit enorme. Es más fácil revertir si algo sale mal.
3. **Mensajes de commit descriptivos** — escribí qué hiciste, no "cambios" o "update".
4. **Hacer `fetch` antes de empezar a trabajar cada día** — así sabés si tus compañeros pushearon algo nuevo.
5. **No borrar ramas de compañeros** — si hay algo que te molesta, preguntá primero.
6. **Nunca subir contraseñas, tokens ni archivos `.env`** — si lo hacés por error, avisá inmediatamente.

---

## PARTE 6 — Estructura de ramas de este proyecto (InnovaLab)

```
main          → versión estable, solo para releases
  │
  └── develop → rama principal de desarrollo, todo se mergea acá
        │
        ├── feature/backend        → equipo de backend (Laravel)
        ├── feature/data-ia        → TU RAMA (Data e IA)
        ├── feature/router         → frontend
        ├── feature/components     → frontend
        └── feature/sidebar        → frontend
```

**Tu rama es `feature/data-ia`.** Todo lo que hagas va acá.
Cuando terminás una tarea grande, le avisás al equipo para mergear a `develop`.

---

*Guía creada durante el proyecto InnovaLab — Centro de Simulación*
*Equipo: BI, Data & IA — Sprint 1, Semana 2*
