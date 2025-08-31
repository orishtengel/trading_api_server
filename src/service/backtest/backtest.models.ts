// Backtest Model that matches the manager contract
export interface Backtest {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  status: string;
}
