import { Prisma } from '@prisma/client';

export class PaymentRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createPayment(data: any): Promise<any> {
    return await this.prisma.payment.create({ data });
  }

  async findPaymentById(id: string): Promise<any | null> {
    return await this.prisma.payment.findUnique({ where: { id } });
  }

  async findAllPayments(): Promise<any[]> {
    return await this.prisma.payment.findMany();
  }

  async updatePayment(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.payment.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deletePayment(id: string): Promise<boolean> {
    const result = await this.prisma.payment.delete({ where: { id } });
    return !!result;
  }

  async findPaymentsByOrder(orderId: string): Promise<any[]> {
    return await this.prisma.payment.findMany({
      where: { orderId },
    });
  }

  async findPaymentByTransactionId(transactionId: string): Promise<any | null> {
    return await this.prisma.payment.findUnique({
      where: { transactionId },
    });
  }
}
