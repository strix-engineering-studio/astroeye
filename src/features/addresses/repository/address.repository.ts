import { Prisma } from '@prisma/client';

export class AddressRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createAddress(data: any): Promise<any> {
    return await this.prisma.address.create({ data });
  }

  async findAddressById(id: string): Promise<any | null> {
    return await this.prisma.address.findUnique({ where: { id } });
  }

  async findAllAddresses(): Promise<any[]> {
    return await this.prisma.address.findMany();
  }

  async updateAddress(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.address.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const result = await this.prisma.address.delete({ where: { id } });
    return !!result;
  }

  async findAddressesByCustomerId(customerId: string): Promise<any[]> {
    return await this.prisma.address.findMany({
      where: { customerId },
    });
  }

  async findDefaultAddress(userId: string): Promise<any | null> {
    return await this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }
}
