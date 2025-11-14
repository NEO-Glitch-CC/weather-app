"use client";

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useUserStore } from '@/store/userStore';

interface DataPoint {
  savedAt: string;
  uvIndex?: number | null;
}

export default function UVChart({ userId }: { userId?: string | null }) {
  const [data, setData] = useState<DataPoint[]>([]);
  const storeUser = useUserStore((s) => s.user);

  useEffect(() => {
    const id = userId ?? storeUser?.id;
    if (!id) return;

    fetch(`/api/weather/history?userId=${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res)) {
          const points = res
            .map((w: any) => ({ savedAt: w.savedAt, uvIndex: w.uvIndex }))
            .filter((p: DataPoint) => p.uvIndex != null)
            .reverse();
          setData(points);
        }
      })
      .catch((e) => console.error(e));
  }, [userId, storeUser]);

  if (!data.length) return <p className="text-sm text-gray-500">No UV history available.</p>;

  return (
    <div className="w-full h-64">
      <h4 className="text-lg font-semibold mb-2">UV Index History</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="savedAt" tickFormatter={(v) => new Date(v).toLocaleDateString()} />
          <YAxis />
          <Tooltip labelFormatter={(v) => new Date(v).toLocaleString()} />
          <Line type="monotone" dataKey="uvIndex" stroke="#ff7300" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
