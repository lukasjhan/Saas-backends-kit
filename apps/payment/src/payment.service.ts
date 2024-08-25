import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import {
  PaymentMethodType,
  Plan,
  Subscription,
  SubscriptionStatus,
} from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(
    userId: string,
    plan: Plan,
    amount: number,
    currency: string,
    paymentMethodId: number,
  ): Promise<Subscription> {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    return this.prisma.subscription.create({
      data: {
        userId,
        plan,
        amount,
        currency,
        startDate,
        endDate,
        nextBillingDate: endDate,
        status: SubscriptionStatus.ACTIVE,
        paymentMethodId,
      },
    });
  }

  async getSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      include: { paymentMethod: true },
    });
  }

  async cancelSubscription(subscriptionId: number): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: SubscriptionStatus.CANCELED },
    });
  }

  async addPaymentMethod(
    userId: string,
    type: PaymentMethodType,
    lastFourDigits: string,
    expirationDate: Date,
  ) {
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type,
        lastFourDigits,
        expirationDate,
      },
    });
  }

  async getPaymentMethods(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
    });
  }

  async removePaymentMethod(paymentMethodId: number) {
    return this.prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });
  }
}
