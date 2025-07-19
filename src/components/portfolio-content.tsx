'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MutualFund {
  id: number;
  name: string;
}

interface Portfolio {
  id: number;
  mutual_fund: MutualFund;
  value: number;
  date: string;
}

interface NavData {
  date: string;
  value: number;
  kenaikan_hari_ini: number;
  persen_kenaikan_hari_ini: number;
  keuntungan_hari_ini: number;
  akumulasi_keuntungan: number;
  total_balance: number;
}

interface PortfolioDetail {
  nav_data: NavData[];
  portfolio: Portfolio;
  product_name: string;
}

export default function PortfolioContent() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [portfolioDetail, setPortfolioDetail] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/portfolio');
      const data = await res.json();
      setPortfolios(data);
    } catch (error) {
      console.error('Failed to fetch portfolios', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioDetail = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/portfolio/${id}/nav`);
      const data = await res.json();
      setPortfolioDetail(data);
    } catch (error) {
      console.error('Failed to fetch portfolio detail', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    fetchPortfolioDetail(portfolio.id);
  };

  const handleBackToList = () => {
    setSelectedPortfolio(null);
    setPortfolioDetail(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().split('T')[0];
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (selectedPortfolio && portfolioDetail) {
    return (
      <div>
        <button onClick={handleBackToList} className="mb-4 text-blue-600 hover:underline">
          &larr; Back to Portfolio List
        </button>
        <h3 className="text-xl font-semibold mb-2">{portfolioDetail.product_name}</h3>
        <p>Investment Value: {formatCurrency(portfolioDetail.portfolio.value)}</p>
        <p>Date: {formatDate(portfolioDetail.portfolio.date)}</p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>NAV Value</TableHead>
              <TableHead>Daily Increase</TableHead>
              <TableHead>Daily Increase %</TableHead>
              <TableHead>Daily Profit</TableHead>
              <TableHead>Accumulated Profit</TableHead>
              <TableHead>Total Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioDetail.nav_data.map((nav) => (
              <TableRow key={nav.date}>
                <TableCell>{nav.date}</TableCell>
                <TableCell>{nav.value.toFixed(4)}</TableCell>
                <TableCell>{nav.kenaikan_hari_ini}</TableCell>
                <TableCell>{nav.persen_kenaikan_hari_ini}%</TableCell>
                <TableCell>{nav.keuntungan_hari_ini}</TableCell>
                <TableCell>{nav.akumulasi_keuntungan}</TableCell>
                <TableCell>{nav.total_balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">My Portfolio</h3>
        <Button onClick={() => alert('Add Portfolio clicked')} variant="outline">
          Add Portfolio
        </Button>
      </div>
      <ul>
        {portfolios.map((portfolio) => (
          <li key={portfolio.id} className="mb-4 border p-4 rounded shadow">
            <p><strong>Mutual Fund Name:</strong> {portfolio.mutual_fund.name}</p>
            <p><strong>Investment Value:</strong> {formatCurrency(portfolio.value)}</p>
            <p><strong>Purchase Date:</strong> {formatDate(portfolio.date)}</p>
            <div className="mt-2 space-x-2">
              <Button onClick={() => handleViewDetails(portfolio)} variant="outline">
                View Details
              </Button>
              <Button onClick={() => alert('Edit Portfolio clicked')} variant="outline">
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
