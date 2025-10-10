"use client";

import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { id: '1', name: 'Monthly Sales Report', type: 'Sales', date: '2025-10-01', status: 'Ready', size: '2.4 MB' },
    { id: '2', name: 'User Activity Report', type: 'Users', date: '2025-10-01', status: 'Ready', size: '1.8 MB' },
    { id: '3', name: 'Vendor Performance Report', type: 'Vendors', date: '2025-10-01', status: 'Processing', size: '-' },
    { id: '4', name: 'Product Inventory Report', type: 'Products', date: '2025-09-30', status: 'Ready', size: '3.2 MB' },
    { id: '5', name: 'Financial Summary', type: 'Finance', date: '2025-09-30', status: 'Ready', size: '1.2 MB' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Generate and download platform reports</p>
          </div>
          <Button icon={FileText}>
            Generate New Report
          </Button>
        </div>

        {/* Quick Report Generation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Sales Report', 'User Report', 'Vendor Report', 'Product Report'].map((report) => (
            <div key={report} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <FileText className="mb-3 text-[#C8102E]" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">{report}</h3>
              <p className="text-sm text-gray-600 mb-4">Generate latest {report.toLowerCase()}</p>
              <Button size="sm" fullWidth>Generate</Button>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{report.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">{report.type}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{report.date}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={report.status === 'Ready' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                  {report.status === 'Ready' && (
                    <Button icon={Download} size="sm" variant="secondary">
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

