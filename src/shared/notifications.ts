export type NotificationChannel = "sms" | "email";
export type NotificationType = "customer_order_confirmation" | "admin_new_order";
export type NotificationRecipientType = "customer" | "admin";
export type NotificationDeliveryStatus = "pending" | "sent" | "failed" | "not_configured" | "skipped_no_consent";

export type NotificationDeliverySummary = {
  channel: NotificationChannel;
  notificationType: NotificationType;
  recipientType: NotificationRecipientType;
  status: NotificationDeliveryStatus;
  attemptCount: number;
};

export type AdminNotificationSummary = {
  customerSms: NotificationDeliverySummary[];
  customerEmail: NotificationDeliverySummary[];
  adminSms: NotificationDeliverySummary[];
  adminEmail: NotificationDeliverySummary[];
};
