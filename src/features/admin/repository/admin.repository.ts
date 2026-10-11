import { Prisma } from '@prisma/client';

export class AdminRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createAdmin(data: any): Promise<any> {
    return await this.prisma.admin.create({ data });
  }

  async findAdminById(id: string): Promise<any | null> {
    return await this.prisma.admin.findUnique({ where: { id } });
  }

  async findAllAdmins(): Promise<any[]> {
    return await this.prisma.admin.findMany();
  }

  async updateAdmin(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.admin.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await this.prisma.admin.delete({ where: { id } });
    return !!result;
  }

  async findAdminsByRole(role: string): Promise<any[]> {
    return await this.prisma.admin.findMany({
      where: { role },
    });
  }
}
