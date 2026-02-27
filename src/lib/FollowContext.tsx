"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface FollowContextType {
  following: Set<string>;
  follow: (username: string) => void;
  unfollow: (username: string) => void;
  isFollowing: (username: string) => boolean;
  toggleFollow: (username: string) => void;
}

const FollowContext = createContext<FollowContextType>({
  following: new Set(),
  follow: () => {},
  unfollow: () => {},
  isFollowing: () => false,
  toggleFollow: () => {},
});

export function FollowProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState<Set<string>>(new Set());

  // Load persisted follows from Supabase on mount
  useEffect(() => {
    fetch("/api/follows")
      .then((r) => (r.ok ? r.json() : []))
      .then((usernames: string[]) => {
        if (Array.isArray(usernames) && usernames.length > 0) {
          setFollowing(new Set(usernames));
        }
      })
      .catch(() => {});
  }, []);

  const follow = useCallback((username: string) => {
    setFollowing((prev) => new Set([...prev, username]));
    fetch("/api/follows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).catch(() => {});
  }, []);

  const unfollow = useCallback((username: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      next.delete(username);
      return next;
    });
    fetch("/api/follows", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).catch(() => {});
  }, []);

  const isFollowing = useCallback(
    (username: string) => following.has(username),
    [following]
  );

  const toggleFollow = useCallback(
    (username: string) => {
      if (following.has(username)) unfollow(username);
      else follow(username);
    },
    [following, follow, unfollow]
  );

  return (
    <FollowContext.Provider value={{ following, follow, unfollow, isFollowing, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  return useContext(FollowContext);
}
