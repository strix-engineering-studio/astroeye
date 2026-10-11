import { Prisma } from '@prisma/client';

export class ProductRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createProduct(data: any): Promise<any> {
    return await this.prisma.product.create({ data });
  }

  async findProductById(id: string): Promise<any | null> {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async findAllProducts(): Promise<any[]> {
    return await this.prisma.product.findMany();
  }

  async updateProduct(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.product.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.prisma.product.delete({ where: { id } });
    return !!result;
  }

  async findProductsByCategoryId(categoryId: string): Promise<any[]> {
    return await this.prisma.product.findMany({
      where: { categoryId },
    });
  }

  async findProductByName(name: string): Promise<any | null> {
    return await this.prisma.product.findUnique({
      where: { name },
    });
  }

  async searchProducts(query: string): Promise<any[]> {
    return await this.prisma.product.findMany({
      where: { OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]},
    });
  }
}
