## Task Management API (Backend)

This is the **backend** for the **Task Management Application**, built with **Node.js**, **Express**, **TypeScript**, and **Sequelize** for **PostgreSQL.**

---

## **Installation & Setup**

### **Fork the Repository**
```sh
gh repo fork https://github.com/LufeMC/lumaa-spring-2025-swe.git --remote=true
mkdir backend
cd backend
```

### **Install Dependencies**
Run the following command to install all required packages:
```sh
npm i
```

This installs:
- **Backend Framework**: `express`
- **Database ORM**: `sequelize`, `pg`, `pg-hstore`
- **Authentication**: `jsonwebtoken`, `bcryptjs`
- **Security Middleware**: `cors`, `helmet`
- **TypeScript Support**: `typescript`, `ts-node`, `@types/*`
- **Development Tools**: `nodemon`

---

## **Environment Variables (`.env`)**
Create a **`.env`** file in the root directory and configure it with:
```env
DATABASE_URL=postgresql://myuser:password@localhost:5432/<database-name>
JWT_SECRET=your-secret-key
PORT=5001
```

---

## **Generating a Strong Random Key for JWT in terminal**
```sh
openssl rand -base64 32
```
This will output a strong 32-byte key, which you can paste into .env

---

## **Setting Up PostgreSQL Database**
### **Start PostgreSQL**
If PostgreSQL is installed, start the database service:
```sh
sudo systemctl start postgresql
```
Or, for macOS (Homebrew):
```sh
brew services start postgresql
```

### **Connect to PostgreSQL**
```sh
sudo psql -U postgres
```
OR

```sh
sudo -i -u postgresql
#postgres:~$ psql
postgres=# 
```

### **Create a New Database**
```sql
CREATE DATABASE taskdb;
```

### **Create a New User**
```sql
CREATE USER myuser WITH ENCRYPTED PASSWORD <password>;
```

### **Grant Permissions to the User**
```sql
GRANT ALL PRIVILEGES ON DATABASE taskdb TO myuser;
\c taskdb 
GRANT ALL ON SCHEMA public TO myuser;
```
\c tasktb connects to taskdb database

### **Grant Privileges to Auto-increment IDs' for your users table**
```sql
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO taskdb;
```

### **Verify Database Connection**
Run:
```sql
\dt
```
If no tables are listed, it means the database is empty but ready.

---

## **Running the Backend**
### **Start the Development Server**
```sh
npm run dev
```
- This uses `nodemon` to reload on file changes.
- The server runs on `http://localhost:5001`.

### **Build & Start Production Server (Optional)**
```sh
npm run build
npm start
```

---

## **Sequelize Commands for Database Setup**
Run these **Sequelize commands** to create models and migrate:
```sh
# Initialize Sequelize (if not already initialized)
npx sequelize-cli init

# Create a migration for the Users table
npx sequelize-cli model:generate --name User --attributes username:string,password:string

# Create a migration for the Tasks table
npx sequelize-cli model:generate --name Task --attributes title:string,description:string,isComplete:boolean,userId:integer

# Run migrations
npx sequelize-cli db:migrate
```