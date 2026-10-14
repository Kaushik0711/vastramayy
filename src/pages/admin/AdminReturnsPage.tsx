import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { storage } from '../../services/storageAdapter';
import { ReturnRequest } from '../../types';
import { formatINR } from '../../utils/pricing';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import {
  RotateCcw,
  Search,
} from 'lucide-react';

export const AdminReturnsPage: React.FC = () => {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const returnsList = await orderService.getAllReturnRequests();
        setReturnRequests(returnsList);
      } catch (err) {
        console.error('Failed to load return requests:', err);
      }
    }
    load();
  }, []);

  const handleUpdateStatus = async (
    returnId: string,
    newStatus: ReturnRequest['status']
  ) => {
    try {
      const allReturns = await orderService.getAllReturnRequests();
      const index = allReturns.findIndex((r) => r.id === returnId);
      if (index === -1) return;

      allReturns[index].status = newStatus;

      // Persist to storage
      await storage.setItem('return_requests', allReturns);
      setReturnRequests([...allReturns]);

      showToast(`Return claim #${returnId} transitioned to "${newStatus.toUpperCase()}".`, 'success');
    } catch (err) {
      showToast('Failed to update return claim.', 'error');
    }
  };

  const filteredReturns = returnRequests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reasonCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReturnRequest['status']) => {
    switch (status) {
      case 'requested':
        return <Badge variant="gold" size="sm">Requested</Badge>;
      case 'approved':
        return <Badge variant="emerald" size="sm">Approved</Badge>;
      case 'pickup_scheduled':
        return <Badge variant="gold" size="sm">Pickup Scheduled</Badge>;
      case 'received':
        return <Badge variant="emerald" size="sm">Atelier Received</Badge>;
      case 'refunded':
        return <Badge variant="emerald" size="sm">Refund Completed</Badge>;
      case 'rejected':
        return <Badge variant="maroon" size="sm">Claim Rejected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Quality Assurance & Aftercare
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">
            Return Requests & Claims
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Audit customer return claims, verify craft security tags, and authorize simulated refunds
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-espresso/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by claim ID or order #..."
            className="w-full pl-9 pr-3 py-2 bg-brand-ivory/40 rounded-lg border border-brand-espresso/15 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none w-full md:w-auto">
          <span className="text-brand-espresso/60 font-semibold shrink-0">Filter Status:</span>
          {['all', 'requested', 'approved', 'pickup_scheduled', 'refunded', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded capitalize text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                statusFilter === s
                  ? 'bg-brand-espresso text-brand-ivory'
                  : 'bg-white border border-brand-espresso/15 text-brand-espresso/70 hover:bg-brand-ivory/50'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
        {filteredReturns.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-espresso">
              No Return Claims Found
            </h3>
            <p className="text-xs text-brand-espresso/60 max-w-xs mx-auto">
              No return requests currently match your filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Claim ID</th>
                    <th className="py-3 px-4">Order Reference</th>
                    <th className="py-3 px-4">Requested On</th>
                    <th className="py-3 px-4">Reason Category</th>
                    <th className="py-3 px-4">Refund Amount</th>
                    <th className="py-3 px-4">Claim Status</th>
                    <th className="py-3 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-espresso/5">
                  {filteredReturns.map((req) => (
                    <tr key={req.id} className="hover:bg-brand-ivory/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-espresso">
                        #{req.id}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-brand-espresso font-serif">
                        #{req.orderNumber}
                      </td>

                      <td className="py-3.5 px-4 text-brand-espresso/60">
                        {formatDate(req.createdAt)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-espresso capitalize">
                          {req.reasonCategory.replace(/_/g, ' ')}
                        </span>
                        {req.comments && (
                          <p className="text-[10px] text-brand-espresso/60 italic truncate max-w-xs">
                            "{req.comments}"
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-brand-espresso">
                        {formatINR(req.refundAmount)}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(req.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'requested' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-7 text-[11px]"
                              onClick={() => handleUpdateStatus(req.id, 'approved')}
                            >
                              Approve
                            </Button>
                          )}

                          {req.status === 'approved' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-7 text-[11px]"
                              onClick={() => handleUpdateStatus(req.id, 'pickup_scheduled')}
                            >
                              Schedule Courier
                            </Button>
                          )}

                          {req.status === 'pickup_scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[11px] text-emerald-800 border-emerald-400"
                              onClick={() => handleUpdateStatus(req.id, 'refunded')}
                            >
                              Verify & Refund
                            </Button>
                          )}

                          {req.status !== 'refunded' && req.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'rejected')}
                              className="px-2 py-1 text-[11px] text-brand-terracotta hover:underline font-semibold"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Alternative View */}
            <div className="md:hidden divide-y divide-brand-espresso/10 p-3 space-y-3">
              {filteredReturns.map((req) => (
                <div key={req.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-brand-espresso/60 block">#{req.id}</span>
                      <span className="font-serif font-bold text-sm text-brand-espresso">Order #{req.orderNumber}</span>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  <div className="text-xs text-brand-espresso/70 space-y-0.5">
                    <p className="capitalize font-semibold text-brand-espresso">
                      Reason: {req.reasonCategory.replace(/_/g, ' ')}
                    </p>
                    {req.comments && (
                      <p className="text-[11px] text-brand-espresso/60 italic">"{req.comments}"</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-brand-espresso/5 text-xs">
                    <span className="text-[11px] text-brand-espresso/60">{formatDate(req.createdAt)}</span>
                    <span className="font-serif font-bold text-sm text-brand-espresso">
                      Refund: {formatINR(req.refundAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {req.status === 'requested' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleUpdateStatus(req.id, 'approved')}
                      >
                        Approve Claim
                      </Button>
                    )}

                    {req.status === 'approved' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleUpdateStatus(req.id, 'pickup_scheduled')}
                      >
                        Schedule Courier
                      </Button>
                    )}

                    {req.status === 'pickup_scheduled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs text-emerald-800 border-emerald-400"
                        onClick={() => handleUpdateStatus(req.id, 'refunded')}
                      >
                        Verify & Refund
                      </Button>
                    )}

                    {req.status !== 'refunded' && req.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'rejected')}
                        className="px-2.5 py-1 text-xs text-brand-terracotta hover:underline font-semibold"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
