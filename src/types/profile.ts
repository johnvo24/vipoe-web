export interface AccountInformationProps {
  full_name?: string;
  username?: string;
  email?: string;
  avt_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  date_of_birth?: string; // Nếu là Date thì sửa thành `Date`
}