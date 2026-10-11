import { Prisma } from '@prisma/client';

export class ShippingRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createShipping(data: any): Promise<any> {
    return await this.prisma.shipping.create({ data });
  }

  async findShippingById(id: string): Promise<any | null> {
    return await this.prisma.shipping.findUnique({ where: { id } });
  }

  async findAllShipplings(): Promise<any[]> {
    return await this.prisma.shipping.findMany();
  }

  async updateShipping(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.shipping.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteShipping(id: string): Promise<boolean> {
    const result = await this.prisma.shipping.delete({ where: { id } });
    return !!result;
  }

  async findShipplingsByOrderId(orderId: string): Promise<any[]> {
    return await this.prisma.shipping.findMany({
      where: { orderId },
    });
  }

  async findShippingByAddressId(addressId: string): Promise<any | null> {
    return await this.prisma.shipping.findUnique({
      where: { addressId },
    });
  }

  async calculateShippingCost(orderData: any): Promise<number> {
    // TODO: Implement shipping cost calculation logic
    const baseRate = 5.0;
    const weightFactor = orderData.weight || 1;
    return baseRate + (weightFactor * 2);
  }
}
