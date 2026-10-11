import { Prisma } from '@prisma/client';

export class CustomerRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createCustomer(data: any): Promise<any> {
    return await this.prisma.customer.create({ data });
  }

  async findCustomerById(id: string): Promise<any | null> {
    return await this.prisma.customer.findUnique({ where: { id } });
  }

  async findAllCustomers(): Promise<any[]> {
    return await this.prisma.customer.findMany();
  }

  async updateCustomer(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.customer.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await this.prisma.customer.delete({ where: { id } });
    return !!result;
  }

  async findCustomersByEmail(email: string): Promise<any | null> {
    return await this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async findCustomersByStatus(status: string): Promise<any[]> {
    return await this.prisma.customer.findMany({
      where: { status },
    });
  }
}
