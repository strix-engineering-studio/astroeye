import { Prisma } from '@prisma/client';

export class InventoryRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createInventory(data: any): Promise<any> {
    return await this.prisma.inventory.create({ data });
  }

  async findInventoryById(id: string): Promise<any | null> {
    return await this.prisma.inventory.findUnique({ where: { id } });
  }

  async findAllInventories(): Promise<any[]> {
    return await this.prisma.inventory.findMany();
  }

  async updateInventory(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.inventory.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteInventory(id: string): Promise<boolean> {
    const result = await this.prisma.inventory.delete({ where: { id } });
    return !!result;
  }

  async findInventoriesByProductId(productId: string): Promise<any[]> {
    return await this.prisma.inventory.findMany({
      where: { productId },
    });
  }

  async updateInventoryQuantity(productId: string, quantityChange: number): Promise<boolean> {
    const result = await this.prisma.inventory.update({
      where: { productId },
      data: { quantity: { increment: quantityChange } },
    });
    return !!result;
  }

  async findLowStockInventories(threshold: number): Promise<any[]> {
    return await this.prisma.inventory.findMany({
      where: { quantity: lt(threshold) },
    });
  }
}
