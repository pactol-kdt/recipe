export type DashboardData = {
  cash: number;
  ingredientsLastUpdate: string;
  lowStockCount: number;
  pendingSalesCount: number;
  recipeSales: {
    current_week_sold: number;
    sold_percentage_change: number;
    current_week_batch_made: number;
    batch_made_percentage_change: number;
  };
};
