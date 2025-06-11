# 📦 Backend API - ZoSale Dashboard

Proyecto backend en Node.js + Express para una demo de dashboard analítico (ZoSale).  
Incluye autenticación, carga de datos por CSV, y endpoints para KPIs de negocio.

---

## ⚙️ Stack tecnológico

- Node.js + Express
- MongoDB + Mongoose
- JWT + Bcrypt
- Multer + CSV parser
- Dayjs
- Dotenv

---

## 🚀 Instalación

```bash
git clone https://github.com/Albiwiver/Dasboards-Express.git
cd Dasboards-Express
npm install
```

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<ddbb>?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta
```

## ▶️ Levantar el servidor

Instala las dependencias y ejecuta el proyecto en modo desarrollo:

```bash
npm install
npm run dev
```

## 🔐 Autenticación

Este backend usa autenticación con JWT.  
Una vez registrado o logueado, recibirás un token que debe enviarse en las rutas protegidas.

### Headers necesarios para rutas privadas:

```http
Authorization: Bearer <token>
```

## 🧑‍💼 Endpoints de Autenticación

| Método | Ruta                 | Descripción                           | Body requerido              | Respuesta esperada                    |
| ------ | -------------------- | ------------------------------------- | --------------------------- | ------------------------------------- |
| POST   | `/api/auth/register` | Registra un nuevo usuario             | `{ name, email, password }` | `201 Created` <br> Usuario registrado |
| POST   | `/api/auth/login`    | Inicia sesión y genera token JWT      | `{ email, password }`       | `200 OK` <br> `{ token: "..." }`      |
| POST   | `/api/auth/forgot`   | Genera token para restablecer la pass | `{ email }`                 | `200 OK` <br> Token generado          |
| POST   | `/api/auth/reset`    | Establece nueva contraseña            | `{ token, newPassword }`    | `200 OK` <br> Contraseña actualizada  |

> Todas las contraseñas son hasheadas con `bcrypt`.  
> Los tokens son firmados con JWT y se deben usar en el header:
>
> ```
> Authorization: Bearer <token>
> ```

## 📈 Endpoints de Analytics

Todos los endpoints de analítica están bajo el prefijo:
| Método | Ruta | Descripción | Parámetros de consulta (`query`) | Autenticación |
|--------|----------------------------------|-------------------------------------------------|-------------------------------------------------------|----------------|
| GET | `/net-income` | Retorna total neto + variación % | `from`, `to` (`YYYY-MM-DD`) | ✅ Requiere JWT |
| GET | `/total-orders` | Número total de órdenes + variación % | `from`, `to` | ✅ Requiere JWT |
| GET | `/avg-sales` | Promedio de ventas por día | `from`, `to` | ✅ Requiere JWT |
| GET | `/canceled-orders` | Número de órdenes canceladas + variación % | `from`, `to` | ✅ Requiere JWT |
| GET | `/orders` | Listado de órdenes con filtros y paginación | `from`, `to`, `status`, `page`, `limit` | ✅ Requiere JWT |

> Todos los endpoints aceptan los parámetros `from` y `to` como fechas en formato `YYYY-MM-DD`.  
> Si no se especifican, se usará el rango de los últimos 7 días por defecto.

## 📥 Carga de datos por CSV

Este endpoint permite a los usuarios subir un archivo `.csv` con órdenes para ser agregadas a la base de datos.  
Es útil para cargar datos históricos o masivos sin necesidad de una interfaz gráfica.

El backend se encarga de parsear, validar y guardar los datos en MongoDB.

---

### 📄 Formato del archivo CSV

El archivo debe tener los siguientes campos en su primera fila:

```csv
transactionId,from,to,amount,status,createdAt
TX1001,Mystore,Ana,1200,COMPLETED,2025-06-01T10:00:00Z
```

#### 📌 Requisitos:

- `transactionId`, `from`, `to`: cadenas de texto
- `amount`: debe ser un número
- `status`: uno de los siguientes valores:
  - `COMPLETED`
  - `PENDING`
  - `CANCELED`
- `createdAt`: fecha en formato ISO  
  Ejemplo válido: `2025-06-01T10:00:00Z`

  ### 📤 Endpoint de subida de CSV

| Método | Ruta                     | Descripción                        | Autenticación   | Tipo de body                          |
| ------ | ------------------------ | ---------------------------------- | --------------- | ------------------------------------- |
| POST   | `/api/orders/upload-csv` | Sube un archivo `.csv` con órdenes | ✅ Requiere JWT | `multipart/form-data` (clave: `file`) |
