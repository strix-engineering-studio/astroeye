import { Prisma } from '@prisma/client';

export class CategoryRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createCategory(data: any): Promise<any> {
    return await this.prisma.category.create({ data });
  }

  async findCategoryById(id: string): Promise<any | null> {
    return await this.prisma.category.findUnique({ where: { id } });
  }

  async findAllCategories(): Promise<any[]> {
    return await this.prisma.category.findMany();
  }

  async updateCategory(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.category.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.prisma.category.delete({ where: { id } });
    return !!result;
  }

  async findCategoriesByParentId(parentId: string): Promise<any[]> {
    return await this.prisma.category.findMany({
      where: { parentId },
    });
  }

  async findCategoryByName(name: string): Promise<any | null> {
    return await this.prisma.category.findUnique({
      where: { name },
    });
  }
}
