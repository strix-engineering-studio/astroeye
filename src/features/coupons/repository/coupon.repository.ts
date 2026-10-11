import { Prisma } from '@prisma/client';

export class CouponRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createCoupon(data: any): Promise<any> {
    return await this.prisma.coupon.create({ data });
  }

  async findCouponById(id: string): Promise<any | null> {
    return await this.prisma.coupon.findUnique({ where: { id } });
  }

  async findAllCoupons(): Promise<any[]> {
    return await this.prisma.coupon.findMany();
  }

  async updateCoupon(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.coupon.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    const result = await this.prisma.coupon.delete({ where: { id } });
    return !!result;
  }

  async findCouponsByCode(code: string): Promise<any | null> {
    return await this.prisma.coupon.findUnique({
      where: { code },
    });
  }

  async findActiveCoupons(): Promise<any[]> {
    return await this.prisma.coupon.findMany({
      where: { isActive: true, expiresAt: null },
    });
  }
}
