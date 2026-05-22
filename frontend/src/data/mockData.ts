export const investmentPlans = [
  {
    id: 'bronze',
    name: 'Bronze',
    icon: '🥉',
    price: 5000,
    weeklyReturn: 1.5,
    annualReturn: 65.0,
    referralBonus: 2.0,
    withdrawalPeriod: '17 weeks',
    minWithdrawal: 1600,
    earlyWithdrawalFee: 20.0,
    color: 'from-orange-600 to-orange-700',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-500',
  },
  {
    id: 'silver',
    name: 'Silver',
    icon: '🥈',
    price: 15000,
    weeklyReturn: 1.5,
    annualReturn: 78.0,
    referralBonus: 2.5,
    withdrawalPeriod: '17 weeks',
    minWithdrawal: 1800,
    earlyWithdrawalFee: 15.0,
    color: 'from-slate-600 to-slate-700',
    bgColor: 'bg-slate-600',
    borderColor: 'border-slate-500',
    popular: true,
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: '🥇',
    price: 25000,
    weeklyReturn: 2.0,
    annualReturn: 104.0,
    referralBonus: 3.0,
    withdrawalPeriod: '17 weeks',
    minWithdrawal: 4500,
    earlyWithdrawalFee: 10.0,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-400',
  },
];

export const whyChooseFeatures = [
  {
    icon: '🔒',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    title: 'Secure Platform',
    description: 'Bank-level security with multi-layer encryption to protect your investments',
  },
  {
    icon: '📊',
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    title: 'Proven Returns',
    description: 'Consistent weekly returns with annual yields up to 104%',
  },
  {
    icon: '👥',
    iconBg: 'bg-gradient-to-br from-orange-500 to-yellow-600',
    title: 'Referral Rewards',
    description: 'Earn up to 3% bonus for every successful referral you bring',
  },
];

export const blogArticles = [
  {
    id: 1,
    title: 'The Future of Cryptocurrency Investment',
    excerpt: 'Discover the latest trends and opportunities in the crypto market...',
    date: 'June 15, 2024',
  },
  {
    id: 2,
    title: 'Diversification Strategies for 2024',
    excerpt: 'Learn how to build a balanced portfolio that weathers market volatility...',
    date: 'June 10, 2024',
  },
  {
    id: 3,
    title: 'Risk Management in High Yield Investments',
    excerpt: 'Essential strategies for protecting your capital while maximizing returns...',
    date: 'June 5, 2024',
  },
];

export const newsletters = [
  {
    id: 1,
    title: 'Weekly Market Digest',
    description: 'Market analysis and investment opportunities every Monday',
    subscribers: '12,500+',
    color: 'text-green-600',
  },
  {
    id: 2,
    title: 'Crypto Insights',
    description: 'Deep dives into cryptocurrency trends and projects',
    subscribers: '8,200+',
    color: 'text-blue-600',
  },
  {
    id: 3,
    title: 'Investment Opportunities',
    description: 'Exclusive opportunities and portfolio recommendations',
    subscribers: '15,800+',
    color: 'text-purple-600',
  },
];

export const dashboardStats = [
  {
    icon: '💰',
    label: 'Total Investment',
    value: 'USDT 15,000',
    change: '+0%',
    changeColor: 'text-gray-500',
    iconBg: 'bg-orange-100',
  },
  {
    icon: '📈',
    label: 'Current Balance',
    value: 'USDT 16,875',
    change: '+12.5%',
    changeColor: 'text-green-600',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '⚡',
    label: 'Weekly Earnings',
    value: 'USDT 225',
    change: '+1.5%',
    changeColor: 'text-green-600',
    iconBg: 'bg-yellow-100',
  },
  {
    icon: '👥',
    label: 'Referral Earnings',
    value: 'USDT 450',
    change: '+2.5%',
    changeColor: 'text-green-600',
    iconBg: 'bg-purple-100',
  },
];

export const quickActions = [
  { icon: '💸', label: 'Withdraw Funds', color: 'from-blue-500 to-blue-600' },
  { icon: '⬆️', label: 'Upgrade Plan', color: 'from-purple-500 to-purple-600' },
  { icon: '🎁', label: 'Invite & Earn', color: 'from-green-500 to-green-600' },
  { icon: '📊', label: 'View Reports', color: 'from-orange-500 to-orange-600' },
];

export const transactions = [
  {
    id: 1,
    type: 'Deposit',
    amount: 'USDT 15,000',
    date: 'May 1, 2026',
    status: 'Completed',
    statusColor: 'text-green-600 bg-green-50',
  },
  {
    id: 2,
    type: 'Weekly Earnings',
    amount: 'USDT 225',
    date: 'Apr 28, 2026',
    status: 'Completed',
    statusColor: 'text-green-600 bg-green-50',
  },
  {
    id: 3,
    type: 'Referral Bonus',
    amount: 'USDT 450',
    date: 'Apr 25, 2026',
    status: 'Completed',
    statusColor: 'text-green-600 bg-green-50',
  },
  {
    id: 4,
    type: 'Weekly Earnings',
    amount: 'USDT 225',
    date: 'Apr 21, 2026',
    status: 'Completed',
    statusColor: 'text-green-600 bg-green-50',
  },
];

export const footerLinks = {
  quickLinks: ['About Us', 'Investment Plans', 'How It Works', 'FAQ'],
  support: ['Contact Us', 'Terms of Service', 'Privacy Policy', 'Security'],
};
