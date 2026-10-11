import { Prisma } from '@prisma/client';

export class CartRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createCart(data: any): Promise<any> {
    return await this.prisma.cart.create({ data });
  }

  async findCartById(id: string): Promise<any | null> {
    return await this.prisma.cart.findUnique({ where: { id } });
  }

  async findAllCarts(): Promise<any[]> {
    return await this.prisma.cart.findMany();
  }

  async updateCart(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.cart.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteCart(id: string): Promise<boolean> {
    const result = await this.prisma.cart.delete({ where: { id } });
    return !!result;
  }

  async findCartsByUserId(userId: string): Promise<any[]> {
    return await this.prisma.cart.findMany({
      where: { userId },
    });
  }

  async addToCart(cartId: string, productId: string, quantity: number): Promise<boolean> {
    const result = await this.prisma.cart.update({
      where: { id: cartId },
      data: { items: { connect: { productId, quantity } } },
    });
    return !!result;
  }

  async removeFromCart(cartId: string, productId: string): Promise<boolean> {
    const result = await this.prisma.cart.update({
      where: { id: cartId },
      data: { items: { disconnect: { productId } } },
    });
    return !!result;
  }
}
