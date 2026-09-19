/* eslint-disable */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding roles and initial admin...')

  const roles = [
    { key: 'SUPER_ADMIN', name: 'Super Admin', permissions: ['*'] },
    { key: 'ADMIN', name: 'Admin', permissions: ['products.manage', 'content.publish', 'users.manage'] },
    { key: 'EDITOR', name: 'Editor', permissions: ['content.create', 'content.edit'] },
    { key: 'PRODUCT_OWNER', name: 'Product Owner', permissions: ['products.create', 'products.edit'] },
    { key: 'SALES', name: 'Sales', permissions: ['leads.view', 'leads.manage'] },
  ]

  for (const r of roles) {
    await prisma.role.upsert({
      where: { key: r.key },
      update: { name: r.name, permissions: r.permissions },
      create: { key: r.key, name: r.name, permissions: r.permissions },
    })
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@strix.website'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Strix Admin', roles: ['SUPER_ADMIN'] },
    create: { name: 'Strix Admin', email: adminEmail, roles: ['SUPER_ADMIN'] },
  })

  console.log('Seeded admin:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
