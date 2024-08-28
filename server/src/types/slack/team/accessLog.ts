export interface TeamAccessLog {
  user_id: string;
  username: string;
  date_first: number;
  date_last: number;
  count: number;
  ip?: string;
  user_agent?: string;
  isp?: string;
  country?: string;
  region?: string;
}
