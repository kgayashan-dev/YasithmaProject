# Yasithma Products — Premium Ceylon Botanicals E-Commerce Platform

Full-stack Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, and SQLite e-commerce application built for **Yasithma Products** (Pothuhera, Sri Lanka).

## 1. Local Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   The default `DATABASE_URL` creates a local SQLite database at `prisma/dev.db`. Set a secure `JWT_SECRET` before deploying.

3. **Add your product photographs:**
   Save your product images into `public/images/products/` using these filenames (or update paths via Admin):
   - `blue-butterfly-tea.jpg`
   - `heen-bovitiya-powder.jpg`
   - `welpenala-powder.jpg`
   - `curry-leaves-powder.jpg`
   - `hibiscus-tea.jpg`
   - `iramusu-tea.jpg`
   - `yaki-naran-powder.jpg`
   - `black-pepper-crate.jpg`

4. **Push Prisma schema & seed the verified Yasithma catalogue:**
   ```bash
   npx prisma generate
   npm run db:push
   npm run db:seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Visit `http://YOUR_LOCAL_IP:3000` for the storefront and `http://YOUR_LOCAL_IP:3000/account` (sign in with `admin@yasithmaproducts.lk` / `ChangeMe123!`) to access `/admin`. Your phone or another device must be connected to the same Wi-Fi network.

6. **Run automated tests:**
   ```bash
   npm test
   ```
