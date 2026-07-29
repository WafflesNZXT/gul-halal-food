export const ADMIN_ORDERS_ROUTE = "/admin/orders";

export function getAdminLoginViewState(session: { isLoading: boolean; isFetching: boolean; isSuccess: boolean }) {
  if (session.isLoading || session.isFetching) return "checking" as const;
  if (session.isSuccess) return "authenticated" as const;
  return "unauthenticated" as const;
}
