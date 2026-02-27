"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ApprovedChannel {
  channel_name: string;
  platform: string;
  age_min?: number;
  age_max?: number;
}

interface ApprovedChannelsContextType {
  channels: ApprovedChannel[];
  isApproved: (channelName: string) => boolean;
  loading: boolean;
}

const ApprovedChannelsContext = createContext<ApprovedChannelsContextType>({
  channels: [],
  isApproved: () => false,
  loading: true,
});

export function ApprovedChannelsProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<ApprovedChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/approved-channels")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setChannels(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isApproved = (channelName: string): boolean => {
    const normalized = channelName.toLowerCase();
    return channels.some((ch) =>
      ch.channel_name.toLowerCase().includes(normalized) ||
      normalized.includes(ch.channel_name.toLowerCase())
    );
  };

  return (
    <ApprovedChannelsContext.Provider value={{ channels, isApproved, loading }}>
      {children}
    </ApprovedChannelsContext.Provider>
  );
}

export function useApprovedChannels() {
  return useContext(ApprovedChannelsContext);
}
